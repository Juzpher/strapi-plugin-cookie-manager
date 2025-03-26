import { prefixPluginTranslations } from "@strapi/helper-plugin";
import { PluginIcon, Initializer } from "./components";
import { pluginId, pluginName } from "./utils";
import { getTrad } from "./utils";

export default {
  register(app) {
    // Register the plugin in the settings section
    app.settings.addSettingsLink({
      id: pluginId,
      to: `/settings/${pluginId}`,
      intlLabel: { id: getTrad("plugin.name"), defaultMessage: `${pluginName} Plugin` },
      Component: async () => {
        const component = await import(/* webpackChunkName: "cookie-manager-settings" */ "./pages/SettingsPage");
        return component;
      },
      permissions: [],
    });

    // Register the plugin in the main menu
    app.menu.addMenuItem({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: getTrad("plugin.name"),
        defaultMessage: pluginName,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ "./pages/App");
        return component;
      },
      permissions: [],
    });

    // Register the plugin
    app.registerPlugin({
      id: pluginId,
      name: pluginName,
      initializer: Initializer,
      isReady: false,
    });
  },

  bootstrap() {},

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, pluginId),
            locale,
          }))
          .catch(() => ({
            data: {},
            locale,
          }));
      })
    );

    return Promise.resolve(importedTrads);
  },
};
