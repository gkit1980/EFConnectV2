import { NgModule } from "@angular/core";
import { ResourcePipe } from "./pipes/resource.pipe";
import { FormatTimePipe } from "./pipes/formatTime.pipe";
import { FilterPipe } from "./pipes/filter.pipe";

@NgModule({
  declarations: [ResourcePipe, FormatTimePipe, FilterPipe],
  imports: [],
  exports: [ResourcePipe, FormatTimePipe, FilterPipe]
})
export class PipesModule {}