
module.exports = (config, lan) => {

    let JSONfile = require(`../locales/${lan}.json`);
    let exportJSON;
    let desiredConfig = config;

    if (config.size() === 0 || config.size() === 14) return JSONfile;

    if(config.userInfo) exportJSON += JSONfile.userInfo;
    if(config.signUpInfo) exportJSON += JSONfile.signUpInfo; 
    if(config.buyInfo) exportJSON += JSONfile.buyInfo; 
    if(config.libraryInfo) exportJSON += JSONfile.libraryInfo; 
    if(config.softwareInfo) exportJSON += JSONfile.softwareInfo;
    if(config.ourServicesSection) exportJSON += JSONfile.ourServicesSection; 
    if(config.sectionsInfo) exportJSON += JSONfile.sectionsInfo; 
    if(config.faq) exportJSON += (JSONfile.faq + JSONfile.userAgreementPolicy);
    if(config.err) {
        exportJSON += JSONfile.error404;
        exportJSON += JSONfile.error403;
        exportJSON += JSONfile.error500;
        exportJSON += JSONfile.error503;
        exportJSON += JSONfile.error504;
    }
    
    return JSON.stringify(exportJSON);
}