import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    mode: string;
    bgColor: string;
    textColor: string;
    cardColor: string;
    btnColor: string;
    btnTextColor: string;
  }
}
