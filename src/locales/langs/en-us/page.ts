const page: App.I18n.Schema['translation']['page'] = {
  about: {
    devDep: 'Development Dependencies',
    introduction: `SkyrocAdmin is an elegant and powerful backend management template based on the latest front-end tech stack, including React 19.0, Vite 6, TypeScript, React Router 7, Redux/toolkit, and UnoCSS. It features built-in rich theme configurations and components, strict code standards, and an automated file-based routing system. Additionally, it uses an online Mock data solution based on ApiFox. SkyrocAdmin provides a one-stop backend management solution that works out of the box with no extra configuration. It is also the best practice for quickly learning cutting-edge technologies.`,
    prdDep: 'Production Dependencies',
    projectInfo: {
      githubLink: 'GitHub Link',
      latestBuildTime: 'Latest Build Time',
      previewLink: 'Preview Link',
      title: 'Project Information',
      version: 'Version'
    },
    title: 'About'
  },
  exception: {
    noPermission: {
      desc: 'Sorry, you do not have permission to access this page. Please contact the administrator for authorization.'
    },
    notFound: {
      desc: 'Sorry, the page you visited does not exist.'
    },
    notLogin: {
      desc: 'Sorry, you are not logged in. Please log in first.'
    },
    serverError: {
      desc: 'Sorry, a server error occurred. Please try again later.'
    }
  },
  function: {
    multiTab: {
      backTab: 'Back to function tab',
      routeParam: 'Route Params'
    },
    request: {
      repeatedError: 'Duplicate Request Error',
      repeatedErrorMsg1: 'Custom Request Error 1',
      repeatedErrorMsg2: 'Custom Request Error 2',
      repeatedErrorOccurOnce: 'Duplicate request error occurs only once'
    },
    tab: {
      tabOperate: {
        addMultiTab: 'Add Multi-Tab',
        addMultiTabDesc1: 'Navigate to the multi-tab page',
        addMultiTabDesc2: 'Navigate to the multi-tab page (with query params)',
        addTab: 'Add Tab',
        addTabDesc: 'Navigate to the About page',
        closeAboutTab: 'Close "About" Tab',
        closeCurrentTab: 'Close Current Tab',
        closeTab: 'Close Tab',
        title: 'Tab Operations'
      },
      tabTitle: {
        change: 'Change',
        changeTitle: 'Change Title',
        reset: 'Reset',
        resetTitle: 'Reset Title',
        title: 'Tab Title'
      }
    },
    toggleAuth: {
      adminOrUserVisible: 'Visible to Admin & User',
      adminVisible: 'Visible to Admin',
      authHook: 'Auth Hook Function `hasAuth`',
      superAdminVisible: 'Visible to Super Admin',
      toggleAccount: 'Switch Account'
    }
  },
  home: {
    creativity: 'Creativity',
    dealCount: 'Deal Count',
    downloadCount: 'Downloads',
    entertainment: 'Entertainment',
    greeting: 'Good morning, {{userName}}, another energetic day!',
    message: 'Messages',
    projectCount: 'Projects',
    projectNews: {
      desc1: 'Skyroc created the open-source project skyroc-admin on May 28, 2021!',
      desc2: 'Yanbowe submitted a bug to skyroc-admin: multi-tab does not adapt.',
      desc3: 'Skyroc is preparing for the release of skyroc-admin!',
      desc4: 'Skyroc is busy writing documentation for skyroc-admin!',
      desc5: 'Skyroc just finished the dashboard page roughly!',
      moreNews: 'More News',
      title: 'Project News'
    },
    registerCount: 'Registrations',
    rest: 'Rest',
    schedule: 'Schedule',
    study: 'Study',
    todo: 'To-Do',
    turnover: 'Turnover',
    visitCount: 'Visits',
    weatherDesc: 'Cloudy to sunny today, 20℃ - 25℃!',
    work: 'Work'
  },
  login: {
    bindWeChat: {
      title: 'Bind WeChat'
    },
    codeLogin: {
      getCode: 'Get Code',
      imageCodePlaceholder: 'Enter image captcha',
      reGetCode: 'Re-get in {{time}}s',
      sendCodeSuccess: 'Verification code sent successfully',
      title: 'Code Login'
    },
    common: {
      back: 'Back',
      codeLogin: 'Code Login',
      codePlaceholder: 'Enter verification code',
      confirm: 'Confirm',
      confirmPasswordPlaceholder: 'Confirm password',
      loginOrRegister: 'Login / Register',
      loginSuccess: 'Login successful',
      passwordPlaceholder: 'Enter password',
      phonePlaceholder: 'Enter phone number',
      userNamePlaceholder: 'Enter username',
      validateSuccess: 'Validation successful',
      welcomeBack: 'Welcome back, {{userName}}!'
    },
    pwdLogin: {
      admin: 'Admin',
      forgetPassword: 'Forgot password?',
      otherAccountLogin: 'Other account login',
      otherLoginMode: 'Other login methods',
      register: 'Register',
      rememberMe: 'Remember me',
      superAdmin: 'Super Admin',
      title: 'Password Login',
      user: 'User'
    },
    register: {
      agreement: 'I have read and accepted the',
      policy: 'Privacy Policy',
      protocol: 'User Agreement',
      title: 'Register'
    },
    resetPwd: {
      title: 'Reset Password'
    }
  },
  manage: {
    button: {
      addButton: 'Add Button',
      buttonCode: 'Button Code',
      buttonName: 'Button Name',
      buttonStatus: 'Button Status',
      editButton: 'Edit Button',
      form: {
        buttonCode: 'btn:module:action e.g. btn:sys:user:add',
        buttonName: 'Enter button name',
        buttonStatus: 'Select button status',
        selectMenuName: 'Select menu'
      },
      selectMenuName: 'Menu',
      title: 'Button List'
    },
    common: {
      status: {
        disable: 'Disabled',
        enable: 'Enabled'
      }
    },
    log: {
      form: {
        placeholder: {
          maxCostTime: 'Please enter max cost',
          minCostTime: 'Please enter min cost',
          requestMethod: 'Please select method',
          requestUrl: 'Please enter request path',
          username: 'Please enter username'
        }
      },
      method: {
        delete: 'DELETE',
        get: 'GET',
        post: 'POST',
        put: 'PUT'
      },
      tableTitle: 'System Operation Log',
      title: {
        costTime: 'Cost(ms)',
        createTime: 'Date Range',
        description: 'Description',
        index: 'Index',
        ipAddress: 'IP Address',
        maxCostTime: 'Max Cost(ms)',
        minCostTime: 'Min Cost(ms)',
        operate: 'Operate',
        requestMethod: 'Method',
        requestParams: 'Request Params',
        requestUrl: 'Request Path',
        responseResult: 'Response Result',
        userAgent: 'Client Info',
        username: 'Username'
      }
    },
    menu: {
      activeMenu: 'Active Menu',
      addChildMenu: 'Add Submenu',
      addMenu: 'Add Menu',
      button: 'Button',
      buttonCode: 'Button Code',
      buttonDesc: 'Button Description',
      component: 'Component Path',
      constant: 'Constant Route',
      editMenu: 'Edit Menu',
      fixedIndexInTab: 'Fixed Tab Index',
      form: {
        activeMenu: 'Select active menu route name',
        button: 'Is button',
        buttonCode: 'Enter button code',
        buttonDesc: 'Enter button description',
        fixedIndexInTab: 'Enter fixed tab index',
        fixedInTab: 'Fixed in tab',
        hideInMenu: 'Hide in menu',
        home: 'Home',
        href: 'External Link',
        i18nKey: 'I18n Key',
        icon: 'Icon',
        keepAlive: 'Cache route',
        layout: 'Layout component',
        localIcon: 'Local icon',
        menuName: 'Menu name',
        menuStatus: 'Menu status',
        menuType: 'Menu type',
        multiTab: 'Multi-tab',
        order: 'Sort',
        page: 'Page component',
        parent: 'Parent menu',
        pathParam: 'Path params',
        queryKey: 'Query key',
        queryValue: 'Query value',
        routeName: 'Route name',
        routePath: 'Route path'
      },
      hideInMenu: 'Hide In Menu',
      home: 'Home',
      href: 'External Link',
      i18nKey: 'I18n Key',
      icon: 'Icon',
      iconType: {
        iconify: 'Iconify Icon',
        local: 'Local Icon'
      },
      iconTypeTitle: 'Icon Type',
      id: 'ID',
      keepAlive: 'Cache Route',
      layout: 'Layout',
      localIcon: 'Local Icon',
      menuName: 'Menu Name',
      menuStatus: 'Menu Status',
      menuType: 'Menu Type',
      multiTab: 'Multi-Tab',
      order: 'Sort',
      page: 'Page Component',
      parent: 'Parent Menu',
      parentId: 'Parent ID',
      pathParam: 'Path Params',
      query: 'Route Params',
      routeName: 'Route Name',
      routePath: 'Route Path',
      title: 'Menu List',
      type: {
        directory: 'Directory',
        menu: 'Menu'
      }
    },
    role: {
      addRole: 'Add Role',
      buttonAuth: 'Button Permissions',
      editRole: 'Edit Role',
      form: {
        roleCode: 'e.g. R_SUPER_ADMIN/R_ADMIN/R_GUEST',
        roleDesc: 'Enter role description',
        roleName: 'e.g. Super Admin/Admin/Guest',
        roleStatus: 'Select role status'
      },
      menuAuth: 'Menu Permissions',
      roleCode: 'Role Code',
      roleDesc: 'Role Description',
      roleName: 'Role Name',
      roleStatus: 'Role Status',
      title: 'Role List'
    },
    roleDetail: {
      content: 'This page is only for displaying matching all multi-level dynamic routes',
      explain:
        '[...slug] is the syntax to match all multi-level dynamic routes in the format [...any]. The matched data will be stored as an array in useRoute params.'
    },
    user: {
      addUser: 'Add User',
      avatar: 'Avatar',
      editUser: 'Edit User',
      form: {
        nickName: 'Enter nickname',
        userEmail: 'Enter email',
        userGender: 'Select gender',
        userName: 'Enter username',
        userPassword: 'Enter password',
        userPhone: 'Enter phone',
        userRole: 'Select role',
        userStatus: 'Select status'
      },
      gender: {
        female: 'Female',
        male: 'Male'
      },
      nickName: 'Nickname',
      roleList: 'Roles',
      title: 'User List',
      userEmail: 'Email',
      userGender: 'Gender',
      userId: 'User ID',
      userName: 'Username',
      userPassword: 'Password',
      userPhone: 'Phone',
      userRole: 'Role',
      userStatus: 'Status'
    },
    userDetail: {
      content: `Loader allows network requests and lazy-loaded files to be fetched almost in parallel. While parsing lazy-loaded files, it waits for network requests to complete.
        Once the request finishes, the page renders entirely. Combined with React's Fiber architecture, users can switch pages during waiting if they feel it’s taking too long.
        This is the advantage of React and React Router data routers, unlike the conventional process:
        Request lazy file → Parse → Request data → Mount → Render`,
      explain:
        'This page only demonstrates the powerful loader capability of react-router-dom. Data is random and mismatched is normal.'
    }
  }
};

export default page;
