<template>
  <div class="select">
    <v-select
      v-model="value"
      label="title"
      :filterable="false"
      :options="selectList"
      placeholder="请选择"
      @open="onOpen"
      @close="onClose"
      @search="query => search = query"
    >
      <template #list-footer>
        <li v-show="hasNextPage" ref="load" class="loader">
          Loading more...
        </li>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch
} from 'nuxt-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { getPostsTimeRanking } from '../api/index'
import { PostsTimeRankingDataProps, PostsTimeRankingDataListProps, userProps } from '../types/index.d'

@Component({
  components: {
    'v-select': vSelect
  }
})
export default class PostsSelectMatataki extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  readonly usersData!: userProps

  // select value
  value: PostsTimeRankingDataListProps = { } as PostsTimeRankingDataListProps

  // posts data
  postsData: PostsTimeRankingDataProps = {
    count: 0,
    list: []
  }

  // select loading
  selectLoading: boolean = false

  observer: any = null
  page: number = 1
  search: string = ''

  mounted () {
    if (process.client) {
      this.postsTimeRanking()

      /**
     * You could do this directly in data(), but since these docs
     * are server side rendered, IntersectionObserver doesn't exist
     * in that environment, so we need to do it in mounted() instead.
     */
      this.observer = new IntersectionObserver(this.infiniteScroll)
    }
  }

  @Watch('value')
  onWatchChanged (val: PostsTimeRankingDataListProps) {
    console.log('val', val)
    this.$emit('changedValue', val)
  }

  // 是否有下一页
  get hasNextPage (): boolean {
    if (this.search) {
      return false
    }
    return this.postsData.list.length < this.postsData.count
  }

  // 获取下拉列表
  get selectList (): PostsTimeRankingDataListProps[] {
    if (this.search) {
      // 因为调用查询接口毕竟慢而且不太好用 干脆数组内搜索 有需要再修改
      return this.postsData.list.filter(i => i.title.includes(this.search))
    } else {
      return this.postsData.list
    }
  }

  // 获取 MTK 文章列表
  async postsTimeRanking (): Promise<void> {
    this.selectLoading = true

    try {
      const res = await getPostsTimeRanking({
        author: this.usersData.id,
        page: this.page,
        pagesize: 20
      })
      if (res.code === 0) {
        const data: PostsTimeRankingDataProps = res.data
        this.postsData.count = data.count
        this.postsData.list = this.postsData.list.concat(data.list)
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e.toString())
    } finally {
      this.selectLoading = false
    }
  }

  async onOpen (): Promise<void> {
    if (this.hasNextPage) {
      await this.$nextTick()
      this.observer.observe(this.$refs.load)
    }
  }

  onClose (): void {
    this.observer.disconnect()
  }

  // 无限滚动
  async infiniteScroll ([{ isIntersecting, target }]: any): Promise<void> {
    if (isIntersecting) {
      const ul = target.offsetParent
      const scrollTop = target.offsetParent.scrollTop
      this.page += 1
      await this.postsTimeRanking()
      await this.$nextTick()
      ul.scrollTop = scrollTop
    }
  }
}
</script>

<style lang="less" scoped>
.loader {
  text-align: center;
  color: #bbbbbb;
}
.select /deep/ .vs__dropdown-toggle{
  border: 1px solid #DCDFE6;
  padding: 6px 0 10px;
}
.select /deep/ .vs__search,
.select /deep/ .vs__search:focus {
  color: #606266;
}
</style>
