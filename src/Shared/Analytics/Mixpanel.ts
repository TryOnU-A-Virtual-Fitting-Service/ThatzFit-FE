import mixpanel from 'mixpanel-browser';

import { getLocale } from '@/Shared/Config';
import { getHostPageUrl } from '@/Shared/Lib';

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsProperties = Record<
  string,
  AnalyticsPrimitive | null | undefined
>;

type AnalyticsEventProperties = {
  plugin_loaded: {
    host_page_url: string;
  };
  plugin_opened: {
    host_page_url: string;
  };
  plugin_closed: {
    host_page_url: string;
  };
  fitting_model_selected: {
    default_model_id: number;
    model_name: string;
    is_custom_model: boolean;
  };
  fitting_model_uploaded: {
    default_model_id: number;
    model_name: string;
  };
  fitting_model_upload_failed: {
    error_message: string;
  };
  fitting_model_list_updated: {
    updated_model_count: number;
    deleted_model_count: number;
  };
  fitting_request_submitted: {
    fitting_request_id: string;
    default_model_id: number;
    model_name: string;
    captured_image_type: string;
    captured_image_size_bytes: number;
  };
  virtual_try_on_completed: {
    fitting_request_id: string;
    try_on_job_id: string;
    default_model_id: number;
    model_name: string;
    captured_image_type: string;
    captured_image_size_bytes: number;
    duration_ms: number;
  };
  virtual_try_on_failed: {
    fitting_request_id: string;
    default_model_id: number;
    model_name: string;
    captured_image_type: string;
    captured_image_size_bytes: number;
    duration_ms: number;
    error_message: string;
  };
  fitting_result_viewed: {
    default_model_id: number;
    model_name: string;
  };
  powered_by_clicked: {
    destination_url: string;
  };
};

type AnalyticsEventName = keyof AnalyticsEventProperties;

let isMixpanelInitialized = false;

const getMixpanelToken = () => import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN;

const toTrackableProperties = (properties: AnalyticsProperties) => {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => {
      if (value === null || value === undefined) {
        return false;
      }

      return value !== '';
    }),
  ) as Record<string, AnalyticsPrimitive>;
};

const getCommonProperties = () =>
  toTrackableProperties({
    app_env: import.meta.env.MODE,
    platform: 'web',
    product_surface: 'embedded_plugin',
    plugin_locale: getLocale(),
    host_page_url: getHostPageUrl(),
  });

export const initializeMixpanel = () => {
  const token = getMixpanelToken();
  if (!token || isMixpanelInitialized) {
    return;
  }

  mixpanel.init(token, {
    autocapture: false,
    debug: import.meta.env.DEV,
    persistence: 'localStorage',
    record_block_selector: '.mp-block',
    record_heatmap_data: true,
    record_mask_all_inputs: false,
    record_mask_all_text: false,
    record_mask_input_selector: '.mp-mask, .mp-sensitive',
    record_mask_text_selector: '.mp-mask, .mp-sensitive',
    record_sessions_percent: 100,
    track_pageview: false,
  });
  isMixpanelInitialized = true;
};

export const identifyMixpanelUser = (userToken: string) => {
  if (!isMixpanelInitialized) {
    return;
  }

  mixpanel.identify(userToken);
  mixpanel.register({
    app_env: import.meta.env.MODE,
    platform: 'web',
    product_surface: 'embedded_plugin',
  });
};

export const trackProductEvent = <TEventName extends AnalyticsEventName>(
  eventName: TEventName,
  properties: AnalyticsEventProperties[TEventName],
) => {
  if (!isMixpanelInitialized) {
    return;
  }

  mixpanel.track(eventName, {
    ...getCommonProperties(),
    ...toTrackableProperties(properties),
  });
};
