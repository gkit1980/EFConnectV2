import {Injector} from '@angular/core';

/**
 * Allows for retrieving singletons using `AppInjector.get(MyService)` (whereas
 * `ReflectiveInjector.resolveAndCreate(MyService)` would create a new instance
 * of the service).
 */
export let AppInjector: Injector;

/**
 * Helper to set the exported {@link AppInjector}
 */
export function setAppInjector(injector: Injector) {
    if (AppInjector) console.error('Programming error: AppInjector was already set'); // Should not happen
    else AppInjector = injector;
}
