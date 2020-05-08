export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
            const result = reader.result;
            if (isArrayBuffer(result)) {
                resolve(result);
            }
            reject('file read error');
        };
        reader.readAsArrayBuffer(file);
    })
}

function isArrayBuffer(result: ArrayBuffer | null | string): result is ArrayBuffer {
    return result !== null && typeof result !== 'string';
}

const fileTagMaxLen = 25;

export function ecllipse(fileTag: string): string {
    return fileTag.slice(0, fileTagMaxLen) + (fileTag.length > fileTagMaxLen? '...' : '');
}
