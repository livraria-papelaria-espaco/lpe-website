import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default (strapi) => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: App,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    suffixUrl: () => '/pending',
    suffixUrlToReplaceForLeftMenuHighlight: '/pending',
    trads,
    menu: {
      // Set a link into the PLUGINS section
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}/pending`, // Endpoint of the link
          icon: pluginPkg.strapi.icon,
          label: {
            id: `${pluginId}.plugin.name`, // Refers to a i18n
            defaultMessage: 'Order Management',
          },
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
