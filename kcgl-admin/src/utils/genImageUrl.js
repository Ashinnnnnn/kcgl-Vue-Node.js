export const genImageUrl = (url) => {
  if (url?.startsWith('http')) {
    return url
  } else if (url?.startsWith('/images')) {
    return 'http://localhost:3000' + url
  } else {
    return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }
}
