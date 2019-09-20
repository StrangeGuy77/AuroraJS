module.exports = {
  userSessionResponse: currentSession => {
    let userSessionProperties = {
      nonlogged: false,
      loggeduser: false,
      moduser: false,
      adminuser: false,
      superuser: false
    };
    switch (currentSession) {
      case 1:
        userSessionProperties.nonlogged = true;
        return userSessionProperties;
        break;
      case 2:
        userSessionProperties.loggeduser = true;
        return userSessionProperties;
        break;
      case 3:
        userSessionProperties.moduser = true;
        return userSessionProperties;
        break;
      case 4:
        userSessionProperties.adminuser = true;
        return userSessionProperties;
        break;
      case 5:
        userSessionProperties.superuser = true;
        return userSessionProperties;
        break;
      default:
        userSessionProperties.nonlogged = true;
        return userSessionProperties;
        break;
    }
  }
};
