import {Redirect, NavigationInstruction, RouterConfiguration, Router, Next} from 'aurelia-router'
import { checkAuth } from 'authConfig'

const routes =
  [ { route: ['home']
    , name: 'home'
    , moduleId: 'home/component'
    , nav: false
    , title:'home'
    , settings: { roles: [] }
    }
  , { route: ['']
    , nav: false
    , redirect: 'home'
    }
  ]

export class App {
  constructor() {
    this.style = 'style'
  }

  configureRouter(config, router) {
    config.title = 'Home'
    config.pushState = true
    config.addPipelineStep('authorize', AuthorizeStep)
    config.exportToRouter(router)
    config.map(routes)

    config.mapUnknownRoutes(() => 'home/component')

    this.router = router
  }
}



class AuthorizeStep {
  run(navigationInstruction, next) {
    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('auth') !== -1)) {
      if (! checkAuth()) {
        return next.cancel(new Redirect('/'))
      }
    }
    return next();
  }
}