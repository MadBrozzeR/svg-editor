import { Styles } from 'mbr-style';
import { Splux } from 'splux';
import { Cast, SVGOutputIFC, TextareaIFC } from './types';


export const host = {
  styles: Styles.create(),
  text: null as TextareaIFC | null,
  output: null as SVGOutputIFC | null,
  broadcast: null as ((val: Cast) => void) | null,
};

export type Host = typeof host;

export const createComponent = Splux.createComponent<Host>();
