

export { defu as merge } from 'defu';


export function bindMethods<T extends object>(instance: T): void {
    const prototype = Object.getPrototypeOf(instance);
    const propertyNames = Object.getOwnPropertyNames(prototype);

    propertyNames.forEach((propertyName) => {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
        const propertyValue = instance[propertyName as keyof T];

        if (
            typeof propertyValue === 'function' &&
            propertyName !== 'constructor' &&
            descriptor &&
            !descriptor.get &&
            !descriptor.set
        ) {
            instance[propertyName as keyof T] = propertyValue.bind(instance);
        }
    });
}

export function setTDK(data: { title: string; description: string; keyword: string }) {
  document.title = data.title

  const setMeta = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute('name', name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  setMeta('description', data.description)
  setMeta('keywords', data.keyword)
}