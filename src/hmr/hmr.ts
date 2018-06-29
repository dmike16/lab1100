import { ApplicationRef, NgModuleRef } from '@angular/core';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

export function hmrBootstrap(module: any, bootstrap: () => Promise<NgModuleRef<any>>) {
    let moduleRef: NgModuleRef<any>;
    // accept module replacement
    module.hot.accept();
    // Bootstrap the app
    bootstrap().then((m) => moduleRef = m);
    // remove old component
    module.hot.dispose(() => {
        const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
        const nativeComponents = appRef.components.map((cmp) => cmp.location.nativeElement);
        const makeVisible = createNewHosts(nativeComponents);
        removeNgStyles();
        moduleRef.destroy();
        makeVisible();
    });
}
