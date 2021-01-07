function decomposeUrl(url) {
    let protocolCapture = url.match(/(^\w+):\/\//)
    let ipAdressCapture = url.match(/^\w+:\/\/([\d\.]+)/)
    let subDomainCapture = url.match(/^\w+:\/\/([a-z]+)\.\w+\./)
    let domainNameCapture = url.match(/^\w+:\/\/(?:[a-z]+\.)?(\w+\.[a-z]+)/)
    let folderTreeCapture = url.match(/^\w+:\/\/(?:[a-z]+\.)?\w+\.[a-z]+\/([\w\/]+)\//)
    let targetFileCapture = url.match(/\/([\w\.]+)(?:\?.*)?$/)
    let argumentsFile = url.match(/(\?.+)/)
    if (ipAdressCapture && ipAdressCapture[1].split`.`.some(x=> x>255)){
        domainNameCapture = ipAdressCapture
        ipAdressCapture = null
        }
    
    return { protocol:protocolCapture? protocolCapture[1]:null,
            ipAdress:ipAdressCapture? ipAdressCapture[1]:null,
            subDomain:subDomainCapture? subDomainCapture[1]:null,
                domainName:domainNameCapture? domainNameCapture[1]:null,
            targetFile:targetFileCapture? targetFileCapture[1]:null,
            argumentsFile:argumentsFile? argumentsFile[1]:null}
}
  
module.exports = decomposeUrl;