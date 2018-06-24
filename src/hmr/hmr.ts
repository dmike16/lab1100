import { ApplicationRef } from '@angular/core';
import { createNewHosts, removeNgStyles } from '@angularclass/hmr';

export function hmrModule(ngModuleRef: any, module: any) {
    if (module && module['hot']) {
        // accept module replacement
        module.hot.accept();
        // remove old component
        module.hot.dispose(() => {
            const appRef: ApplicationRef = ngModuleRef.injector.get(ApplicationRef);
            const nativeComponents = appRef.components.map((cmp) => cmp.location.nativeElement);
            const makeVisible = createNewHosts(nativeComponents);
            removeNgStyles();
            ngModuleRef.destroy();
            makeVisible();
        });
    }
}
