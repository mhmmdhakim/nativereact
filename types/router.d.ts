/* eslint-disable */
import * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownInputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
        | { pathname: `${"/(tabs)"}/index`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(tabs)"}/Lesson`;
            params?: Router.UnknownInputParams;
          }
        | {
            pathname: `${"/(tabs)"}/Lesson`;
            params?: { lessonId?: string };
          }
        | {
            pathname: `${"/(tabs)"}/Practice`;
            params?: { id?: string };
          }
        | { pathname: `${"/(auth)"}/login`; params?: Router.UnknownInputParams }
        | {
            pathname: `${"/(auth)"}/register`;
            params?: Router.UnknownInputParams;
          };
      hrefOutputParams:
        | {
            pathname: Router.RelativePathString;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: Router.ExternalPathString;
            params?: Router.UnknownOutputParams;
          }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${"/(tabs)"}` | `/`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/index`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/Lesson`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(tabs)"}/Practice`;
            params?: { id?: string };
          }
        | {
            pathname: `${"/(auth)"}/login`;
            params?: Router.UnknownOutputParams;
          }
        | {
            pathname: `${"/(auth)"}/register`;
            params?: Router.UnknownOutputParams;
          };
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/_sitemap${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/index${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/Lesson${`?${string}` | `#${string}` | ""}`
        | `${"/(tabs)"}/Practice${`?${string}` | `#${string}` | ""}`
        | `${"/(auth)"}/login${`?${string}` | `#${string}` | ""}`
        | `${"/(auth)"}/register${`?${string}` | `#${string}` | ""}`
        | `/${`?${string}` | `#${string}` | ""}`;
    }
  }
}
