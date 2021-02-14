const getUrlParams = (url) => {
  const paramsList = url.slice(url.indexOf('?')).substr(1).split('&')
  const params = {}

  paramsList.forEach(item => {
    if(item === '') return

    const param = item.split('=')
    params[param[0]] = param[1]
  })

  return params
}

export default getUrlParams
