export interface TextareaIFC {
  set(value: string, cursorAt?: number): void;
  insert(value: string, cursorAt?: number): void;
}

export interface SVGOutputIFC {
  update(value: string): void;
  rescale(value: 'up' | 'down'): void;
}
