/**
 * TypeScript 6 rejects side-effect imports it cannot resolve to a declaration,
 * which includes the `import "./globals.css"` that Next requires. These wildcard
 * declarations make the stylesheet imports legal without loosening anything else.
 */
declare module "*.css";
declare module "*.scss";
