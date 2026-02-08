import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { toErrorMessage } from "./utils";

const logInfo = (message: string): void => {
  console.info(`[updater] ${message}`);
};

const logError = (error: unknown): void => {
  console.error(`[updater] ${toErrorMessage(error)}`);
};

export const installUpdateIfAvailable = async (): Promise<void> => {
  try {
    const update = await check();
    if (!update) return;
    logInfo(`Update ${update.currentVersion} -> ${update.version}`);
    await update.downloadAndInstall();
    await relaunch();
  } catch (error) {
    logError(error);
  }
};
