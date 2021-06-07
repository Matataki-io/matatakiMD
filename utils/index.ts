// 生成简介
export const generateShortContent = (name: string): string => {
  try {
    if (!name) {
      throw new Error('not document name')
    }

    const dom: any = document.querySelectorAll(name) // 有些导入的文章是 Section 等标签包裹的，所以选择所有 P
    const domList = [...dom].filter(i => !!(i.innerText.trim())) // 过滤一些没有内容的
    const str = domList.reduce((t, c) => {
      return `${t} ${c.innerText}`
    }, '')
    // console.log(str)
    return (str.trim()).slice(0, 300)
  } catch (e) {
    console.log('e', e.toString())
    return '...'
  }
}

// 生成标题
export const generateTitle = (name: string): string => {
  try {
    if (!name) {
      throw new Error('not document name')
    }

    const titleDom = (document as any).querySelector(name)
    return titleDom ? titleDom.innerText : 'Untitled'
  } catch (e) {
    console.log(e.toString())
    return 'Untitled'
  }
}
