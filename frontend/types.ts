export type User = {
  login: string;
  image: string;
  is_cadet: boolean;
  // id: string;
};

export interface ChartDimension {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  width?: number;
  height?: number;
}
