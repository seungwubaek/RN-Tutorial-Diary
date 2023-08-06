import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    mode: string;
    bgColor: string;
    headerColor: string;
    textColor: string;
    loadingBgColor: string;
    loadingTintColor: string;
    cardColor: string;
    btnColor: string;
    btnTextColor: string;
    borderColor: string;
  }
}
