import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IBreadcrumb } from '../../breadcrumbs/breadcrumbs.interface';
import { ISelectedFilter } from '../../product-list/filter/selected-filter.interface';
import { ActivatedRoute } from '@angular/router';
import { HeadService } from '../../services/head/head.service';
import { NgUnsubscribe } from '../../shared/directives/ng-unsubscribe.directive';
import { SEARCH_QUERY_PARAM } from '../../shared/constants';

@Component({
  selector: 'search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent extends NgUnsubscribe implements OnInit {

  searchQuery: string;
  breadcrumbs: IBreadcrumb[];
  productListFilters: ISelectedFilter[];

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private headService: HeadService) {
    super();
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(paramMap => {
      this.searchQuery = paramMap.get(SEARCH_QUERY_PARAM);

      this.setListFilters();
      this.setBreadcrumbs();
      this.setMeta();
    });
  }

  private setListFilters() {
    this.productListFilters = [{ id: SEARCH_QUERY_PARAM, valueId: this.searchQuery }];
  }

  private setBreadcrumbs() {
    this.breadcrumbs = [{ title: `Результаты поиска` }];
  }

  private setMeta() {
    let title = `Результаты поиска`;
    if (this.searchQuery) {
      title += `: "${this.searchQuery}"`;
    }

    this.headService.setMeta({ title, description: '' });
  }
}
