import { Component, Vue } from 'vue-property-decorator'
@Component({

})
export class CommonMixins extends Vue {
  protected paginationInfo = {
    total: 0,
    limit: 20,
    page: 1
  }

  protected pageSizes = [20, 40, 80, 100]
}
