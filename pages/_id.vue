<template>
  <div class="container">
    <div class="header">
      <el-button type="primary" size="small">
        同步到Matataki
      </el-button>
      <el-button type="primary" size="small">
        同步到IPFS
      </el-button>
      <el-button type="primary" size="small" @click="dialogVisible = !dialogVisible">
        同步到GitHub
      </el-button>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px"
      >
        <div>
          <a
            href="https://github.com/login/oauth/authorize?client_id=07025561030e5b006396&scope=repo"
          >
            <el-button size="small">Github Login</el-button>
          </a>
          <el-button size="small" @click="handPushEvent">
            Push
          </el-button>
          <el-button size="small" @click="handPullEvent">
            Pull
          </el-button>
        </div>
        <form action="" style="margin: 20px 0 0 0;">
          <div>
            <label for="repo">Repo</label>
            <el-select id="repo" v-model="repos[0].name" name="repo">
              <!-- <option value="">--Please choose a repo--</option> -->
              <el-option v-for="(item, idx) of repos" :key="idx" :value="item.name">
                {{ item.name }}
              </el-option>
            </el-select>
          </div>
          <div>
            <label for="branch">Branch</label>
            <el-select id="branch" v-model="branches[0].name" name="branch">
              <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name">
                {{ item.name }}
              </el-option>
            </el-select>
          </div>
          <div>
            <label for="file">File</label>
            <el-select id="file" v-model="contents[0].name" name="file">
              <el-option v-for="(item, idx) of contents" :key="idx" :value="item.name">
                {{ item.name }}
              </el-option>
            </el-select>
          </div>
        </form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <client-only>
      <mavon-editor
        ref="md"
        v-model="markdownData"
        :box-shadow="false"
        :autofocus="false"
        placeholder="请输入内容"
        :style="editorStyle"
        class="editor"
        image-upload-action="customize"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import { throttle, debounce } from 'lodash'
import {
  Component,
  Inject,
  Model,
  Prop,
  Provide,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import { push, pull, usersRepos, reposBranches, reposContentsList } from '../api/index'
import '@matataki/editor/dist/css/index.css'

let mavonEditor: any = {
  mavonEditor: null
}
if (process.client) {
  mavonEditor = require('@matataki/editor')
}

@Component({
  components: {
    'mavon-editor': mavonEditor.mavonEditor
  }
})
export default class Edidtor extends Vue {
  resizeEvent: any = null
  editorStyle = {}
  markdownData = ''

  dialogVisible = false

  repos= [
    {
      name: 'xiaotiandada/HackMD'
    },
    {
      name: 'xiaotiandada/cli-ant'
    },
    {
      name: 'xiaotiandada/cli-ant-temp'
    },
    {
      name: 'xiaotiandada/codimd'
    },
    {
      name: 'xiaotiandada/takeaway'
    },
    {
      name: 'xiaotiandada/uniscam-interface-1'
    },
    {
      name: 'xiaotiandada/copy-animation'
    },
    {
      name: 'xiaotiandada/docker'
    },
    {
      name: 'xiaotiandada/ant-design'
    },
    {
      name: 'xiaotiandada/xiaotiandada'
    },
    {
      name: 'xiaotiandada/react-roadmap'
    },
    {
      name: 'xiaotiandada/Case'
    },
    {
      name: 'xiaotiandada/chrome-extension'
    },
    {
      name: 'xiaotiandada/egg-ratelimiter'
    },
    {
      name: 'xiaotiandada/blog'
    },
    {
      name: 'xiaotiandada/xiaotiandada.github.io'
    },
    {
      name: 'xiaotiandada/vue-notes'
    },
    {
      name: 'xiaotiandada/Matataki-Token-AirDropper'
    },
    {
      name: 'xiaotiandada/moon-apollo'
    },
    {
      name: 'xiaotiandada/monorepo'
    },
    {
      name: 'xiaotiandada/tool-ant'
    },
    {
      name: 'xiaotiandada/lodash-1'
    },
    {
      name: 'xiaotiandada/vue'
    },
    {
      name: 'xiaotiandada/ast'
    },
    {
      name: 'xiaotiandada/vue-1'
    },
    {
      name: 'xiaotiandada/mvvm'
    },
    {
      name: 'xiaotiandada/codebird-js'
    },
    {
      name: 'xiaotiandada/swerve-tron'
    },
    {
      name: 'xiaotiandada/bestswap-pools-interface'
    },
    {
      name: 'xiaotiandada/uniswap-interface'
    }
  ]

  branches= [{
    name: 'main',
    commit: {
      sha: 'd40ea65b62acf268fcf9158ed18b70859a13e437',
      url: 'https://api.github.com/repos/xiaotiandada/HackMD/commits/d40ea65b62acf268fcf9158ed18b70859a13e437'
    },
    protected: false
  }]

  contents= [
    {
      name: 'README.md'
    },
    {
      name: 'README1.md'
    },
    {
      name: 'async.md'
    },
    {
      name: 'hello.md'
    }
  ]

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
      this.getContent()

      this.handleResizeEditor()
      this.resizeEvent = throttle(this.handleResizeEditor, 300)
      window.addEventListener('resize', this.resizeEvent)
    }
  }

  @Watch('markdownData')
  onMdChangeed (val: string, oldVal: string) {
    console.log('val', val, oldVal)
    // window.localStorage.setItem('md', val)
    this.asyncContent(val)
  }

  async getContent (): Promise<void> {
    const res = await this.$localForage.getItem(this.$route.params.id)
    this.markdownData = res.content
  }

  asyncContent = debounce(async (val: string) => {
    await this.$localForage.setItem(this.$route.params.id, {
      title: 'Features',
      content: val,
      create_time: Date.now()
    })
  }, 1000)

  handleResizeEditor (): void {
    const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
    // const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
    this.editorStyle = {
      // height: `${clientHeight - (clientWidth < 768 ? 47 : 60)}px`
      height: `${clientHeight - 50}px`
    }
  }

  async handPushEvent (): Promise<void> {
    await push({ contents: this.markdownData })
  }

  async handPullEvent (): Promise<void> {
    const res: any = await pull()
    if (res.code === 0) {
      this.markdownData = res.data.content
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}
.editor {
  width: 100%;
}

.header {
  height: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 2px 10px  rgba(0, 0, 0, .05);
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
}
</style>
