const getUrlParams = () => {
  const paramsList = window.location.search.substr(1).split('&')
  const params = {}

  paramsList.forEach(item => {
    const param = item.split('=')
    params[param[0]] = param[1]
  })

  return params
}

export default getUrlParams
