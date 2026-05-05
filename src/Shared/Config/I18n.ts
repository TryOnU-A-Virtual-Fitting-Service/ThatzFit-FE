export const SUPPORTED_LOCALES = ['ko', 'ja', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = 'ko';

type PluginCopy = {
  common: {
    cancel: string;
    confirm: string;
    done: string;
  };
  plugin: {
    reload: string;
    errorLine1: string;
    errorLine2: string;
    poweredBy: string;
    companyLogoAlt: string;
    companySloganAlt: string;
    entryButtonAlt: string;
  };
  fitting: {
    button: string;
    loading: string;
    failed: string;
    completed: string;
    apiDisabled: string;
    dialogAriaLabel: string;
    previewAlt: string;
    confirmTitle: string;
    confirmHelp: string;
    captureGuide: string;
    captureFailed: string;
    captureTooLarge: string;
    captureSecurity: string;
    capturePermission: string;
    captureUnsupported: string;
    captureEmpty: string;
  };
  history: {
    title: string;
    empty: string;
    info: string;
    resultAlt: string;
  };
  model: {
    addTitle: string;
    addQuestion: string;
    addHelpLine1: string;
    addHelpLine2: string;
    selectTitle: string;
    editTitle: string;
    zoomIn: string;
    zoomOut: string;
    uploadLoading: string;
    uploadSuccess: string;
    maxCount: (count: number) => string;
  };
};

const pluginCopy = {
  ko: {
    common: {
      cancel: '취소',
      confirm: '확인',
      done: '완료',
    },
    plugin: {
      reload: '새로고침',
      errorLine1: '일시적인 오류가 발생했어요.',
      errorLine2: '잠시 후 다시 시도해 주세요.',
      poweredBy: 'ThatzFit에서 피팅중',
      companyLogoAlt: '회사 로고',
      companySloganAlt: '회사 슬로건',
      entryButtonAlt: '플러그인 진입 버튼 로고',
    },
    fitting: {
      button: '입어보기',
      loading: '옷 갈아입는 중...',
      failed: '피팅에 실패했어요.',
      completed: '피팅을 완료했어요.',
      apiDisabled: '피팅 API는 잠시 꺼뒀어요.',
      dialogAriaLabel: '피팅 실행 확인',
      previewAlt: '캡처한 옷 이미지',
      confirmTitle: '이 옷을 입어볼까요?',
      confirmHelp: '상/하의만 입어볼 수 있어요.',
      captureGuide: '입어보고 싶은 옷의 사진 부분을 드래그해 주세요.',
      captureFailed: '옷 캡처에 실패했어요.',
      captureTooLarge:
        '선택 영역이 너무 커서 캡처할 수 없어요. 영역을 조금 줄여주세요.',
      captureSecurity:
        '외부 이미지 보안 정책으로 캡처에 실패했어요. 다시 시도해 주세요.',
      capturePermission:
        '화면 공유 권한을 허용해 주세요. 권한 허용 후 다시 시도해 주세요.',
      captureUnsupported: '현재 브라우저에서 화면 공유 캡처를 지원하지 않아요.',
      captureEmpty: '캡처 이미지 생성에 실패했어요. 다시 시도해 주세요.',
    },
    history: {
      title: '피팅 히스토리',
      empty: '입어본 옷이 없어요. 새로운 옷을 입어볼까요?',
      info: '최대 20개까지 저장됩니다',
      resultAlt: '가상 피팅 결과',
    },
    model: {
      addTitle: '모델 추가',
      addQuestion: '이 사진을 모델 메뉴에 추가할까요?',
      addHelpLine1: '단순한 자세의 단독 전신/반신 사진일수록',
      addHelpLine2: '피팅이 더 자연스럽게 적용돼요!',
      selectTitle: '모델 선택',
      editTitle: '피팅 모델 수정',
      zoomIn: '모델 확대',
      zoomOut: '모델 축소',
      uploadLoading: '모델이 될 준비 중...',
      uploadSuccess: '새로운 모델을 추가했어요.',
      maxCount: (count) => `최대 ${count}개의 모델만 추가할 수 있어요.`,
    },
  },
  ja: {
    common: {
      cancel: 'キャンセル',
      confirm: '確認',
      done: '完了',
    },
    plugin: {
      reload: '再読み込み',
      errorLine1: '一時的なエラーが発生しました。',
      errorLine2: 'しばらくしてからもう一度お試しください。',
      poweredBy: 'ThatzFitで試着中',
      companyLogoAlt: '会社ロゴ',
      companySloganAlt: '会社タグライン',
      entryButtonAlt: 'プラグイン起動ボタンのロゴ',
    },
    fitting: {
      button: '試着する',
      loading: '試着を作成中...',
      failed: '試着を作成できませんでした。',
      completed: '試着が完了しました。',
      apiDisabled: '試着APIは一時的に停止中です。',
      dialogAriaLabel: '試着実行の確認',
      previewAlt: '選択した服の画像',
      confirmTitle: 'この服を試着しますか？',
      confirmHelp: 'トップスまたはボトムスのみ試着できます。',
      captureGuide: '試着したい服の写真部分をドラッグしてください。',
      captureFailed: '服のキャプチャに失敗しました。',
      captureTooLarge: '選択範囲が大きすぎます。少し小さく選択してください。',
      captureSecurity:
        '外部画像のセキュリティ制限によりキャプチャできませんでした。もう一度お試しください。',
      capturePermission:
        '画面共有の権限を許可してから、もう一度お試しください。',
      captureUnsupported: '現在のブラウザは画面キャプチャに対応していません。',
      captureEmpty:
        'キャプチャ画像を作成できませんでした。もう一度お試しください。',
    },
    history: {
      title: '試着履歴',
      empty: 'まだ試着した服はありません。新しい服を試してみませんか？',
      info: '最大20件まで保存されます',
      resultAlt: 'バーチャル試着結果',
    },
    model: {
      addTitle: 'モデルを追加',
      addQuestion: 'この写真をモデルメニューに追加しますか？',
      addHelpLine1: 'シンプルなポーズの全身・半身写真ほど',
      addHelpLine2: 'より自然な試着結果になります。',
      selectTitle: 'モデルを選択',
      editTitle: '試着モデルを編集',
      zoomIn: 'モデルを拡大',
      zoomOut: 'モデルを縮小',
      uploadLoading: 'モデルを準備中...',
      uploadSuccess: '新しいモデルを追加しました。',
      maxCount: (count) => `追加できるモデルは最大${count}件です。`,
    },
  },
  en: {
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      done: 'Done',
    },
    plugin: {
      reload: 'Reload',
      errorLine1: 'Something went wrong.',
      errorLine2: 'Please try again in a moment.',
      poweredBy: 'Fitting with ThatzFit',
      companyLogoAlt: 'Company logo',
      companySloganAlt: 'Company tagline',
      entryButtonAlt: 'Plugin launch button logo',
    },
    fitting: {
      button: 'Try on',
      loading: 'Creating your try-on...',
      failed: "We couldn't generate the try-on.",
      completed: 'Try-on complete.',
      apiDisabled: 'The try-on API is temporarily paused.',
      dialogAriaLabel: 'Confirm try-on',
      previewAlt: 'Captured clothing image',
      confirmTitle: 'Try on this item?',
      confirmHelp: 'Only tops and bottoms are supported.',
      captureGuide: 'Drag over the item you want to try on.',
      captureFailed: "We couldn't capture the item.",
      captureTooLarge:
        'The selected area is too large. Please make it smaller.',
      captureSecurity:
        "We couldn't capture this external image because of its security policy. Please try again.",
      capturePermission: 'Allow screen sharing, then try again.',
      captureUnsupported: "This browser doesn't support screen capture.",
      captureEmpty: "We couldn't create the captured image. Please try again.",
    },
    history: {
      title: 'Try-on history',
      empty: 'No items tried on yet. Try something new?',
      info: 'Up to 20 items are saved',
      resultAlt: 'Virtual try-on result',
    },
    model: {
      addTitle: 'Add model',
      addQuestion: 'Add this photo to your model menu?',
      addHelpLine1: 'Simple full-body or half-body photos',
      addHelpLine2: 'usually create more natural results.',
      selectTitle: 'Select model',
      editTitle: 'Edit fitting models',
      zoomIn: 'Zoom model',
      zoomOut: 'Zoom out',
      uploadLoading: 'Preparing your model...',
      uploadSuccess: 'New model added.',
      maxCount: (count) => `You can add up to ${count} models.`,
    },
  },
} satisfies Record<Locale, PluginCopy>;

let currentLocale: Locale = DEFAULT_LOCALE;

export function normalizeLocale(
  value: string | null | undefined,
): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace('_', '-');
  const [language] = normalized.split('-');
  return SUPPORTED_LOCALES.includes(language as Locale)
    ? (language as Locale)
    : null;
}

function getParentDocumentLocale(): Locale | null {
  try {
    return normalizeLocale(window.parent?.document?.documentElement.lang);
  } catch {
    return null;
  }
}

export function resolveLocale(): Locale {
  return (
    normalizeLocale(
      new URLSearchParams(window.location.search).get('locale'),
    ) ??
    getParentDocumentLocale() ??
    normalizeLocale(navigator.languages?.[0]) ??
    normalizeLocale(navigator.language) ??
    normalizeLocale(document.documentElement.lang) ??
    DEFAULT_LOCALE
  );
}

export function initializeI18n() {
  currentLocale = resolveLocale();
  document.documentElement.lang = currentLocale;
  return currentLocale;
}

export function getLocale() {
  return currentLocale;
}

export function getPluginCopy() {
  return pluginCopy[currentLocale];
}
