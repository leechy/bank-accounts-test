import * as admin from "firebase-admin";
import "firebase-functions";

if (!admin.apps.length) {
  admin.initializeApp();
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

export * from "./api";
export * from "./rates";
