# domain-interfaces

This library was generated with [Nx](https://nx.dev).

## Description

This librarie holds the interfaces for data elements, ensuring consistency between backend and frontend

## Usage

```javascript
import { Iuser } from '@pmspads/domain-interfaces';

class User implements IUser {
  id: string;
  username: string;
  // Other fields defined by IUser
}
```

## Building

Run `nx build domain-interfaces` to build the library.

## Running unit tests

Run `nx test domain-interfaces` to execute the unit tests via [Jest](https://jestjs.io).
