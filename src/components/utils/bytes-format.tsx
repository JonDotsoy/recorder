import type { BytesFormatOptions } from "../dtos/bytes-format-options";

export class BytesFormat {
  #byteFormatter: Intl.NumberFormat;
  #kilobyteFormatter: Intl.NumberFormat;
  #megabyteFormatter: Intl.NumberFormat;
  #gigabyteFormatter: Intl.NumberFormat;
  #petabyteFormatter: Intl.NumberFormat;
  #terabyteFormatter: Intl.NumberFormat;

  constructor(
    locale: string | undefined = undefined,
    optionsInit: BytesFormatOptions | undefined = undefined,
  ) {
    const options: BytesFormatOptions = {
      ...optionsInit,
      maximumFractionDigits: optionsInit?.maximumFractionDigits ?? 2,
    };

    this.#byteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "byte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });

    this.#kilobyteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "kilobyte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });

    this.#megabyteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "megabyte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });

    this.#gigabyteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "gigabyte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });

    this.#terabyteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "terabyte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });

    this.#petabyteFormatter = new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "petabyte",
      unitDisplay: options?.unitDisplay,
      maximumFractionDigits: options?.maximumFractionDigits,
      maximumSignificantDigits: options?.maximumSignificantDigits,
    });
  }

  format(bytes: number): string {
    if (bytes < 1024) {
      return this.#byteFormatter.format(bytes);
    }
    if (bytes < 1024 * 1024) {
      return this.#kilobyteFormatter.format(bytes / 1024);
    }
    if (bytes < 1024 * 1024 * 1024) {
      return this.#megabyteFormatter.format(bytes / (1024 * 1024));
    }
    if (bytes < 1024 * 1024 * 1024 * 1024) {
      return this.#gigabyteFormatter.format(bytes / (1024 * 1024 * 1024));
    }
    if (bytes < 1024 * 1024 * 1024 * 1024 * 1024) {
      return this.#terabyteFormatter.format(
        bytes / (1024 * 1024 * 1024 * 1024),
      );
    }

    return this.#petabyteFormatter.format(
      bytes / (1024 * 1024 * 1024 * 1024 * 1024),
    );
  }
}
