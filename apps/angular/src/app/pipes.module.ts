import { NgModule } from "@angular/core";
import { FormatTimePipe } from "./pipes/formatTime.pipe";
import { ResourcePipe } from "./pipes/resource.pipe";
import { FilterPipe } from "./pipes/filter.pipe";


@NgModule({
  declarations: [FormatTimePipe, FilterPipe,ResourcePipe],
  imports: [],
  exports: [FormatTimePipe, FilterPipe,ResourcePipe]
})
export class PipesModule {}
