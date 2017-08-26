import { useView, inject } from 'aurelia-framework'


const routes =
  [ { route: 'landing'
    , name: 'home.landing'
    , moduleId: 'landing/component'
    , nav: false
    , title: 'landing'
    , settings: { roles: [] }
    }
  , { route: 'collection'
    , name: 'home.collection'
    , moduleId: 'collection/component'
    , nav: false
    , title: 'collection'
    , settings: { roles: ['auth'] }
    }
  , { route: 'collection/item/:id/edit'
    , name: 'item.edit'
    , href: 'item.edit'
    , moduleId: 'collection/item/component'
    , nav: false
    , title: 'edit'
    , settings: { roles: ['auth'] }
    }
  , { route: 'collection/item/add'
    , name: 'item.add'
    , moduleId: 'collection/item/component'
    , nav: true
    , title: 'add'
    , settings: { roles: ['auth'] }
    }
  , { route: ['']
    , nav: false
    , redirect: 'landing'
    }
  ]

@useView('./view.html')
export class Home {
  constructor() {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.map(routes)

    config.mapUnknownRoutes(_ => 'landing/component')

    this.router = router
  }

}