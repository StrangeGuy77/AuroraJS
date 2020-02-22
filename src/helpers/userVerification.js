module.exports = {
  userSessionResponse: currentSession => {
    let userSessionProperties = {
      nonlogged: false,
      nonverified: false,
      loggeduser: false,
      moduser: false,
      adminuser: false,
      superuser: false
    };
    switch (currentSession) {
      case 0:
        userSessionProperties.nonlogged = true;
        return userSessionProperties;
      case 1:
        userSessionProperties.nonverified = true;
        return userSessionProperties;
      case 2:
        userSessionProperties.loggeduser = true;
        return userSessionProperties;
      case 3:
        userSessionProperties.moduser = true;
        return userSessionProperties;
      case 4:
        userSessionProperties.adminuser = true;
        return userSessionProperties;
      case 5:
        userSessionProperties.superuser = true;
        return userSessionProperties;
      default:
        userSessionProperties.nonlogged = true;
        return userSessionProperties;
    }
  }
};
