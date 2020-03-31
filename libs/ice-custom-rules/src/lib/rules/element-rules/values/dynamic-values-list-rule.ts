import { IceConsole, IceElement, ItemElement, ValuesRule } from '@impeo/ice-core';
import {
  every,
  get,
  isArray,
  isEqual,
  isNil,
  isNumber,
  isPlainObject,
  isString,
  keys,
  toString
} from 'lodash';
import { BehaviorSubject, merge, Subscription, timer } from 'rxjs';
import { debounce, distinctUntilChanged } from 'rxjs/operators';

//
//
export class DynamicValuesListRule extends ValuesRule {
  private $dataStoreUpdate = new BehaviorSubject<any>(null);
  private changeElementsSubscription: Subscription;
  private changeDataStoreSubscription: Subscription;
  private options: { value: string; label: string }[];
  private index: number[] | null;
  private isInitialized = false;

  constructor(public element: ItemElement, protected recipe: any, public ruleName: string) {
    super(element, recipe, ruleName);

    this.changeDataStoreSubscription = this.dataStore.subscribe(this.datastoreRootPath, {
      next: () => {
        if (!this.isInitialized) {
          this.options = this.evaluateOptions(this.index);
          this.$reevaluate.next();
        }
        this.$dataStoreUpdate.next(this.dataStore.get(this.datastoreRootPath));
      }
    });

    this.iceModel.$iceModelReady.subscribe(() => {
      this.initialize();
    });
  }

  public getValues(index: number[] | null): any[] {
    this.updateIndex(index);
    const values = keys(this.options)
      .map(key => get(this.options, [key]))
      .map(object => get(object, 'value'));
    return values;
  }

  getOptions(index: number[] | null): { value: string; label: string }[] {
    this.updateIndex(index);
    return this.options;
  }

  public get datastoreRootPath(): string {
    return this.getParam('datastoreRootPath');
  }

  private updateIndex(index: number[] | null) {
    if (isEqual(this.index, index)) return;
    this.index = index;
    this.options = this.evaluateOptions(index);
  }

  private initialize() {
    if (this.isInitialized) {
      IceConsole.error('Multiple initialization not allowed!');
      return;
    }

    const subjects = this.pathElements.map(element => element.$dataModelValueChange);
    subjects.push(this.$dataStoreUpdate);

    this.isInitialized = true;

    this.changeElementsSubscription = merge(...subjects)
      .pipe(
        debounce(() => timer(20)),
        distinctUntilChanged()
      )
      .subscribe((...rest) => {
        this.options = this.evaluateOptions(this.index);
        this.$reevaluate.next();
      });
  }

  private evaluateOptions(index): { value: string; label: string }[] {
    const pathElementValues = this.pathElements.map(element => element.getValue().forIndex(index));
    const list: { value: string; label: string }[] = get(this.dataStore.data, [
      this.datastoreRootPath,
      ...pathElementValues
    ]);

    // cover the case when we have the data as array of numbers or strings
    if (isArray(list)) {
      if (every(list, isString) || every(list, isNumber)) {
        return list.map(this.createListItem);
      }
    }

    // cover the case when we have the data as object, use object keys as values
    if (isPlainObject(list)) return keys(list).map(this.createListItem);

    return list || [];
  }

  private get pathElements(): IceElement[] {
    const elementNames = this.getParam('pathElements', []);
    return elementNames
      .filter(elementName => !isNil(get(this.iceModel.elements, elementName)))
      .map(elementName => get(this.iceModel.elements, elementName));
  }

  private createListItem(data: any): { value: string; label: string } {
    return { ['value']: data, ['label']: toString(data) };
  }
}
