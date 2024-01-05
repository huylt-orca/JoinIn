// ** Icon imports
// import Login from 'mdi-material-ui/Login'
// import Table from 'mdi-material-ui/Table'
// import CubeOutline from 'mdi-material-ui/CubeOutline'
// import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
// import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
// import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
// import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
// import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

import HomeOutline from 'mdi-material-ui/HomeOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import {
  Account,
  AccountGroup,
  Application,
  ArrowLeftCircleOutline,
  Cog,
  CommentAlert,
  FileOutline,
  FileTree,
  CashMultiple,
  AccountCogOutline,
  AccountGroupOutline
} from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { groupDBDexie } from 'src/models/db/GroupDB'
import { groupAPI } from 'src/api-client'
import { CommonResponse } from 'src/models/common/CommonResponse'

const navUser: VerticalNavItemsType = [
  {
    title: 'My Groups',
    icon: HomeOutline,
    path: '/my-groups'
  },
  {
    title: 'To do',
    icon: FileOutline,
    path: '/to-do'
  },
  {
    title: 'Finding Groups',
    icon: AccountGroup,
    path: '/finding-groups'
  },
  {
    sectionTitle: 'Personal'
  },
  {
    title: 'Profile',
    icon: Account,
    path: '/profile'
  },
  {
    title: 'Feedback',
    icon: CommentAlert,
    path: '/feedback'
  }

  // {
  //   sectionTitle: 'Template'
  // },
  // {
  //   title: 'Dashboard',
  //   icon: HomeOutline,
  //   path: '/'
  // },
  // {
  //   title: 'Account Settings',
  //   icon: AccountCogOutline,
  //   path: '/account-settings'
  // },
  // {
  //   sectionTitle: 'Pages'
  // },
  // {
  //   title: 'Login',
  //   icon: Login,
  //   path: '/user/login?back=1', '/user/login',
  //   openInNewTab: false
  // },
  // {
  //   title: 'Register',
  //   icon: AccountPlusOutline,
  //   path: '/pages/register',
  //   openInNewTab: true
  // },
  // {
  //   title: 'Error',
  //   icon: AlertCircleOutline,
  //   path: '/pages/error',
  //   openInNewTab: true
  // },
  // {
  //   sectionTitle: 'User Interface'
  // },
  // {
  //   title: 'Typography',
  //   icon: FormatLetterCase,
  //   path: '/typography'
  // },
  // {
  //   title: 'Icons',
  //   path: '/icons',
  //   icon: GoogleCirclesExtended
  // },
  // {
  //   title: 'Cards',
  //   icon: CreditCardOutline,
  //   path: '/cards'
  // },
  // {
  //   title: 'Tables',
  //   icon: Table,
  //   path: '/tables'
  // },
  // {
  //   icon: CubeOutline,
  //   title: 'Form Layouts',
  //   path: '/form-layouts'
  // }
]

const navLeader: VerticalNavItemsType = [
  {
    title: 'Task',
    icon: FileTree,
    path: '/group/task'
  },
  {
    title: 'Members',
    icon: AccountGroup,
    path: '/group/member'
  },
  {
    title: 'Application',
    icon: Application,
    path: '/group/application'
  },
  {
    sectionTitle: 'Group info'
  },
  {
    title: 'Info',
    icon: Account,
    path: '/group/view-group'
  },
  {
    title: 'Settings',
    icon: Cog,
    path: '/group/group-setting'
  },
  {
    sectionTitle: 'Others'
  },
  {
    title: 'Back to Home',
    icon: ArrowLeftCircleOutline,
    path: '/my-groups'
  }
]

const navMember: VerticalNavItemsType = [
  {
    title: 'Task',
    icon: FileTree,
    path: '/group/task'
  },
  {
    title: 'Members',
    icon: AccountGroup,
    path: '/group/member'
  },

  {
    sectionTitle: 'Group info'
  },
  {
    title: 'Info',
    icon: Account,
    path: '/group/view-group'
  },
  {
    sectionTitle: 'Others'
  },
  {
    title: 'Back to Home',
    icon: ArrowLeftCircleOutline,
    path: '/my-groups'
  }
]

const navAdmin: VerticalNavItemsType = [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/admin/dashboard'
  },
  {
    title: 'Transaction',
    icon: CashMultiple,
    path: '/admin/transaction'
  },
  {
    title: 'User Manage',
    icon: AccountCogOutline,
    path: '/admin/user'
  },

  // {
  //   title: 'Group Manage',
  //   icon: AccountGroupOutline,
  //   path: '/admin/group'
  // },
  {
    title: 'Majors Manage',
    icon: AccountGroupOutline,
    path: '/admin/major'
  },
  {
    sectionTitle: 'Personal'
  },
  {
    title: 'Profile',
    icon: Account,
    path: '/admin/profile'
  }
]

export default function Navigation(): VerticalNavItemsType {
  const router = useRouter()
  const [nav, setNav] = useState<VerticalNavItemsType>(navUser)

  const checkRole = async () => {
    await groupDBDexie.getGroup().then(async groupData => {
      if (!groupData?.id) {
        return
      }

      await groupAPI
        .getRoleInGroup(groupData?.id)
        .then(role => {
          const r = new CommonResponse(role).data
          if (r === 'LEADER' || r === 'SUB_LEADER') {
            setNav(navLeader)
          } else {
            setNav(navMember)
          }
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  useEffect(() => {
    getNav()
  }, [])

  const getNav = async () => {
    if (router.pathname.startsWith('/group')) {
      await checkRole()
    } else if (router.pathname.startsWith('/admin')) {
      setNav(navAdmin)
    }
  }

  return nav ?? []
}
