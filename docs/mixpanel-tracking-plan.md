# Mixpanel Tracking Plan

## Context

- Product surface: embedded ThatzFit web plugin
- SDK: `mixpanel-browser`
- Token env: `VITE_MIXPANEL_PROJECT_TOKEN`
- Current project token: `b2cea665e6ad875fb758099d3ce84315`
- Value Moment: `virtual_try_on_completed`
- Identity key: parent-page localStorage `X-UUID`, identified after `/api/v1/user/init` succeeds
- CDP/warehouse: none detected in this frontend
- Consent assumption: current target collection excludes EU/EEA/UK/CH and California consent-gated users. Add a consent gate before regulated-region launch.
- Session Replay: enabled at 100% sample rate with text, ordinary inputs, images, and videos visible by default.

## Session Replay Privacy Configuration

The SDK is configured for unmasked replay review by default:

- `record_sessions_percent: 100`
- `record_mask_all_text: false`
- `record_mask_all_inputs: false`
- `record_block_selector: '.mp-block'`
- `record_mask_text_selector: '.mp-mask, .mp-sensitive'`
- `record_mask_input_selector: '.mp-mask, .mp-sensitive'`
- `record_heatmap_data: true`

Mixpanel still always masks sensitive input types such as `password`, `email`, `tel`, `hidden`, non-empty `autocomplete` inputs, and fields detected as sensitive by name or id. Do not enable network body/header recording unless a separate privacy review approves the exact allowlist.

## Events

| Event                         | Trigger                                                         | Required properties                                                                                                                        |
| ----------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `plugin_loaded`               | Plugin bootstraps, company info loads, and user init succeeds   | `host_page_url`                                                                                                                            |
| `plugin_opened`               | User opens the embedded plugin                                  | `host_page_url`                                                                                                                            |
| `plugin_closed`               | User closes the embedded plugin                                 | `host_page_url`                                                                                                                            |
| `fitting_model_selected`      | User selects a default or custom fitting model                  | `default_model_id`, `model_name`, `is_custom_model`                                                                                        |
| `fitting_model_uploaded`      | Custom fitting model upload succeeds                            | `default_model_id`, `model_name`                                                                                                           |
| `fitting_model_upload_failed` | Custom fitting model upload fails                               | `error_message`                                                                                                                            |
| `fitting_model_list_updated`  | Model edit dialog save succeeds                                 | `updated_model_count`, `deleted_model_count`                                                                                               |
| `fitting_request_submitted`   | User confirms captured clothing image and starts virtual try-on | `fitting_request_id`, `default_model_id`, `model_name`, `captured_image_type`, `captured_image_size_bytes`                                 |
| `virtual_try_on_completed`    | `/api/v1/try-on/fitting` succeeds and returns a result          | `fitting_request_id`, `try_on_job_id`, `default_model_id`, `model_name`, `captured_image_type`, `captured_image_size_bytes`, `duration_ms` |
| `virtual_try_on_failed`       | `/api/v1/try-on/fitting` fails                                  | `fitting_request_id`, `default_model_id`, `model_name`, `captured_image_type`, `captured_image_size_bytes`, `duration_ms`, `error_message` |
| `fitting_result_viewed`       | User lands on the generated fitting result page                 | `default_model_id`, `model_name`                                                                                                           |
| `powered_by_clicked`          | User clicks the ThatzFit landing link in the plugin footer      | `destination_url`                                                                                                                          |

## Common Properties

The analytics helper adds these to every event:

- `app_env`
- `platform`
- `product_surface`
- `plugin_locale`
- `host_page_url`

## Dashboard

Recommended Mixpanel dashboard: `ThatzFit Product Analytics`.

- Daily product activity: `plugin_loaded`, `plugin_opened`, `fitting_request_submitted`, `virtual_try_on_completed`
- Try-on funnel: `plugin_opened` -> `fitting_request_submitted` -> `virtual_try_on_completed` -> `fitting_result_viewed`
- Value Moment by model: `virtual_try_on_completed` broken down by `model_name`
- Try-on failures: `virtual_try_on_failed` broken down by `error_message`
- Model management: `fitting_model_selected`, `fitting_model_uploaded`, `fitting_model_list_updated`

## Governance

- Keep event and property names in snake_case.
- Do not create dynamic event or property names at runtime.
- Do not send raw image data, full file contents, or sensitive user attributes to Mixpanel.
- Session Replay is unmasked by default in the embedded plugin. Add `.mp-mask`, `.mp-sensitive`, or `.mp-block` before introducing any sensitive UI into the replayed surface.
- Add Lexicon descriptions for every shipped event after first ingestion.
- Enable Data Standards and Event Approval in Mixpanel when the project moves beyond initial instrumentation.
