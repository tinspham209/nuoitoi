/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
	readonly VITE_VIETQR_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
