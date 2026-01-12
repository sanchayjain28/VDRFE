const hostname = window?.location?.hostname;

interface IConfig {
  BASE_URL: string;
  USER_BASE_URL: string;
  HOST: string;
}
// For Localhost
const LOCALHOST_CONFIG: IConfig = {
  BASE_URL: "https://dev.test.com/",
  USER_BASE_URL: "https://dev.test.com/",
  HOST: hostname,
};

const DEV_CONFIG: IConfig = {
  BASE_URL: "https://dev.test.com/",
  USER_BASE_URL: "https://dev.test.com/",
  HOST: hostname,
};

const PRE_PROD_CONFIG: IConfig = {
  BASE_URL: "https://prod.test.com/",
  USER_BASE_URL: "https://prod.test.com/",
  HOST: hostname,
};

const configs: IConfig = (() => {
  if (hostname === "localhost") return LOCALHOST_CONFIG;
  if (hostname === "dev") return DEV_CONFIG;
  if (hostname === "prod") return PRE_PROD_CONFIG;
  throw new Error(`Unknown hostname: ${hostname}`);
})();

export { configs };
