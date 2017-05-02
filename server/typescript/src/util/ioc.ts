import {Container, inject, interfaces} from "inversify";
import {autoProvide, makeProvideDecorator, makeFluentProvideDecorator} from "inversify-binding-decorators";

const iocContainer = new Container();

const AutoProvide = autoProvide;
const Inject = inject;
const Provide = makeProvideDecorator(iocContainer);
const fluentProvider = makeFluentProvideDecorator(iocContainer);

const Named = (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
                      name: string) => {
    return fluentProvider(identifier)
        .whenTargetNamed(name)
        .done();
};

const Singleton = (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => {
    return fluentProvider(identifier)
        .inSingletonScope()
        .done();
};

export {iocContainer, AutoProvide, Provide, Singleton, Named, Inject};
