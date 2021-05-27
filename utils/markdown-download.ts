interface Props {
  title: string
  markdown: string
}

const markdownDownload = ({ title, markdown }: Props) => {
  function downloadBlob (blob: any, name = 'file.md') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement('a')

    // Set link's href to point to the Blob URL
    link.href = blobUrl
    link.download = name

    // Append link to the body
    document.body.appendChild(link)

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    )

    // Remove link from body
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  }

  // Usage
  const mdBlob = new Blob([markdown])
  downloadBlob(mdBlob, `${title}.md`)
}

export default markdownDownload
