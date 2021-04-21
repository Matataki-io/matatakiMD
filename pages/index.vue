<template>
  <div class="container">
    <ul class="item">
      <li v-for="(item, idx) of item" :key="idx">
        <n-link :to="{ name: 'id', params: { id: item } }" target="_blank">
          {{ item }}
        </n-link>
      </li>
    </ul>
    <el-button class="btn" type="primary" @click="handleSubmit">
      Create
    </el-button>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'

@Component({
})
export default class Home extends Vue {
  content = ''

  item: string[] = []

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
      this.getAll()
    }
  }

  @Watch('markdownData')
  onMdChangeed (val: string, oldVal: string) {
    console.log('val', val, oldVal)
  }

  async getAll () :Promise<void> {
    const keys = await (this as any).$localForage.keys()
    console.log('keys', keys)
    this.item = keys
  }

  async handleSubmit () :Promise<void> {
    const time = Date.now()
    await (this as any).$localForage.setItem(time, {
      title: '',
      content: this.content,
      create_time: time,
      update_time: time
    })

    this.getAll()
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
}
.editor {
  width: 100%;
}

.item {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}

.item li {
  width: calc(25% - 8px);
  height: 100px;
  background-color: #f1f1f1;
  margin: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 14px;
}
.btn {
  margin: 20px 0 0 0;
}
</style>
