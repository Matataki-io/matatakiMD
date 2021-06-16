<template>
  <el-popover
    placement="bottom-start"
    width="360"
    trigger="click"
  >
    <div class="ipfs-container">
      <p class="ipfs-title">
        IPFS 列表
      </p>
      <div v-if="ipfsList.length">
        <div v-for="(item, idx) in ipfsList" :key="idx" class="ipfs-item">
          <span>{{ shortHash(item.hash) }} <i class="el-icon-document-copy icon-copy" @click="copyHash(item.hash)" /></span>
          <a :href="item.publicUrl" target="_blank">Fleek</a>
          <a :href="`https://ipfs.io/ipfs/${item.hash}`" target="_blank">IPFS</a>
        </div>
      </div>
      <p v-else class="ipfs-text">
        没有 Ipfs 记录
      </p>
    </div>
    <div slot="reference" class="header-right_icon">
      <svg
        t="1622783016906"
        class="icon-ipfs"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4541"
        width="200"
        height="200"
      ><path d="M245.794 676.096L486.056 814.81V537.376L245.794 398.662z" fill="#5f6266" p-id="4542" /><path d="M271.729 353.733l240.262 138.714 240.273-138.714-240.273-138.72z" fill="#5f6266" p-id="4543" /><path d="M778.2 398.659L537.93 537.372v277.441L778.2 676.092z" fill="#5f6266" p-id="4544" /><path d="M882.897 220.377L583.506 47.53 511.999 6.244 442.823 46.18l-301.73 174.197-69.617 40.204V769.248l68.97 39.817 302.377 174.584 69.176 39.934 71.507-41.286 300.037-173.231 68.981-39.817V260.581l-69.627-40.204zM857.72 753.976c0 5.408 0.655 10.657 1.79 15.727L560.016 942.608c-12.561-10.805-28.864-17.385-46.738-17.385-18.354 0-35.037 6.953-47.733 18.295L164.48 769.702c1.137-5.069 1.787-10.318 1.787-15.727 0-31.542-20.387-58.269-48.68-67.879V342.764c28.292-9.609 48.68-36.332 48.68-67.878 0-5.103-0.556-10.083-1.565-14.879L465.544 86.31c12.697 11.341 29.379 18.293 47.733 18.293 17.874 0 34.178-6.577 46.738-17.386l299.273 172.789a72.374 72.374 0 0 0-1.569 14.879c0 31.546 20.388 58.27 48.683 67.878v343.333c-28.295 9.611-48.682 36.338-48.682 67.88" fill="#5f6266" p-id="4545" /></svg>
    </div>
  </el-popover>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop
} from 'nuxt-property-decorator'
import { FleekIpfs } from '../../types/index.d'

@Component({})
export default class HeaderIpfs extends Vue {
  @Prop({ type: Array, required: true })
  readonly ipfsList!: Array<FleekIpfs>

  // 短 hash
  shortHash (hash: string): string {
    if (!hash) { return '...' }
    const len = 12
    return `${hash.slice(0, len)}...${hash.slice(hash.length - len)}`
  }

  // 复制 hash
  copyHash (hash: string): void {
    this.$copyText(hash).then(() => {
      this.$message.success('复制成功')
    }, () => {
      this.$message.error('复制失败')
    })
  }
}
</script>

<style lang="less" scoped>
.header-right_icon {
  width: 22px;
  height: 22px;
  margin: 0 10px;
}
.icon-ipfs {
  width: 22px;
  height: 22px;
  font-size: 22px;
  color: #5f6266;
  cursor: pointer;
}
.ipfs-container {
  padding: 10px;
  color: #5f6266;
}
.ipfs-title {
  font-size: 16px;
  margin: 0 0 10px;
}
.ipfs-item {
  margin: 10px 0;
  span {
    margin-right: 6px;
  }
  .icon-copy {
    cursor: pointer;
    margin-left: 6px;
  }
  a {
    color: #5f6266;
  }
}
.ipfs-text {
  font-size: 14px;
}
</style>
