// 生成简介
export const generateShortContent = (name: string): string => {
  try {
    if (!name) {
      throw new Error('not document name')
    }

    const dom: any = document.querySelectorAll<HTMLElement>(name) // 有些导入的文章是 Section 等标签包裹的，所以选择所有 P
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

    const titleDom = document.querySelector<HTMLElement>(name)
    return titleDom ? titleDom.innerText : 'Untitled'
  } catch (e) {
    console.log(e.toString())
    return 'Untitled'
  }
}

// ipfs html temp
export const ipfsHtmlTemp = ({ title, content }: { title: string, content: string }) => {
  const htmlTemp =
`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="apple-touch-icon" sizes="180x180" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
  <link rel="icon" type="image/png" sizes="32x32" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">

  <meta name="copyright" property="copyright" content="Copyright © 2018-2021 ANDOROMEDA TECH.ltd">
  <meta name="description" content="Matataki Editor">
  <meta name="keywords" content="Matataki Editor,仙女座科技,瞬MATATAKI,Fan票">

  <meta name="twitter:card" property="twitter:card" content="summary">
  <meta name="twitter:site" property="twitter:site" content="Matataki Editor">
  <meta name="twitter:title" property="twitter:title" content="Matataki Editor">
  <meta name="twitter:image" property="twitter:image" content="https://ssimg.frontenduse.top/material/matataki_logo.png">
  <meta name="twitter:description" property="twitter:description" content="Matataki Editor">

  <meta name="og:type" property="og:type" content="website">
  <meta name="og:site_name" property="og:site_name" content="Matataki Editor">
  <meta name="og:title" property="og:title" content="Matataki Editor">
  <meta name="og:image" property="og:image" content="https://ssimg.frontenduse.top/material/matataki_logo.png">
  <meta name="og:site_name" property="og:site_name" content="Matataki Editor">
  <meta name="og:description" property="og:description" content="Matataki Editor">

<title>${title}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
<style>
  .markdown-body {
    max-width: 860px;
    margin: 0 auto;
  }
</style>
</head>
<body>
<article class="markdown-body">
  ${content}
</article>
</body>
</html>`
  return htmlTemp
}