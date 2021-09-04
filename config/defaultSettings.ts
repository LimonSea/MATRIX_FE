import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "light",
  layout: "top",
  contentWidth: "Fixed",
  headerHeight: 48,
  primaryColor: "#2F54EB",
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'MATRIX',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
};

export default Settings;
