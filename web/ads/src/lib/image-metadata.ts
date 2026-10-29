/** Remove ancillary metadata without touching the encoded pixel stream. */
export async function stripImageMetadata(blob: Blob): Promise<Blob> {
  const b = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(b.buffer);
  const tag = (p: number, n = 4) => String.fromCharCode(...b.subarray(p, p + n));
  const parts: Uint8Array<ArrayBuffer>[] = [];
  if (blob.type === 'image/webp') {
    if (tag(0) !== 'RIFF' || tag(8) !== 'WEBP') throw Error('Invalid encoded WebP.');
    parts.push(b.slice(0, 12));
    for (let p = 12; p < b.length;) {
      if (p + 8 > b.length) throw Error('Invalid WebP chunk.');
      const size = view.getUint32(p + 4, true), end = p + 8 + size + (size % 2);
      if (end > b.length) throw Error('Invalid WebP chunk size.');
      const name = tag(p);
      if (!['EXIF', 'XMP ', 'ICCP'].includes(name)) {
        const chunk = b.slice(p, end);
        if (name === 'VP8X') chunk[8] &= ~0x2c;
        parts.push(chunk);
      }
      p = end;
    }
    new DataView(parts[0].buffer).setUint32(4, parts.reduce((n, p) => n + p.length, 0) - 8, true);
  } else if (blob.type === 'image/png') {
    parts.push(b.slice(0, 8));
    for (let p = 8; p < b.length;) {
      if (p + 12 > b.length) throw Error('Invalid PNG chunk.');
      const end = p + 12 + view.getUint32(p);
      if (end > b.length) throw Error('Invalid PNG chunk size.');
      if (!['eXIf', 'iCCP', 'tEXt', 'zTXt', 'iTXt'].includes(tag(p + 4))) parts.push(b.slice(p, end));
      p = end;
    }
  } else if (blob.type === 'image/jpeg') {
    if (b[0] !== 255 || b[1] !== 216) throw Error('Invalid encoded JPEG.');
    parts.push(b.slice(0, 2));
    for (let p = 2; p < b.length;) {
      if (b[p] !== 255 || p + 1 >= b.length) throw Error('Invalid JPEG marker.');
      const marker = b[p + 1];
      if (marker === 0xda || marker === 0xd9) { parts.push(b.slice(p)); break; }
      if (p + 4 > b.length) throw Error('Invalid JPEG segment.');
      const end = p + 2 + view.getUint16(p + 2);
      if (end > b.length || end <= p + 3) throw Error('Invalid JPEG segment size.');
      if (![0xe1, 0xe2, 0xed, 0xfe].includes(marker)) parts.push(b.slice(p, end));
      p = end;
    }
  } else throw Error('Unsupported prepared image format.');
  return new Blob(parts, { type: blob.type });
}
