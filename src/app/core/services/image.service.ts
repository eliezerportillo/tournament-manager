import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  getImageBlob(url: string): Observable<SafeUrl> {

    /*
    In order to this process works cors config should be run previously for the firebase project.
    Yes, it's possible to configure CORS for Firebase Storage using `gsutil`, which is a command-line tool for working with Google Cloud Storage (GCS), the underlying storage system used by Firebase Storage.

Here are the steps to configure CORS for Firebase Storage using `gsutil`:

1. **Install and Set Up `gsutil`**:

   - Install `gsutil` by following the instructions provided by Google [here](https://cloud.google.com/storage/docs/gsutil_install).
   - Authenticate `gsutil` with your Google Cloud account by running `gsutil config`.

2. **Edit the CORS Configuration**:

   Create a JSON file (e.g., `cors-config.json`) with the desired CORS configuration. Here's an example:

   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

   In this example, we're allowing all origins (`*`) to make `GET` requests with a maximum age of 3600 seconds (1 hour).

3. **Apply the CORS Configuration**:

   Use the following `gsutil` command to set the CORS configuration for your Firebase Storage bucket:

   ```bash
   gsutil cors set cors-config.json gs://your-firebase-project.appspot.com
   ```

   Replace `your-firebase-project` with your actual Firebase project ID.

4. **Verify the CORS Configuration**:

   You can verify that the CORS configuration has been applied by running:

   ```bash
   gsutil cors get gs://your-firebase-project.appspot.com
   ```

   This will display the current CORS configuration for your bucket.

Please make sure to replace `your-firebase-project` with your actual Firebase project ID in the commands.

After applying the CORS configuration, Firebase Storage should allow requests from the specified origins according to the rules you defined in the JSON file. Keep in mind that changes may take some time to propagate. If you still encounter issues, please review the configuration and ensure it matches your requirements.
    */
    return this.http.get(url, { responseType: 'arraybuffer' })
      .pipe(
        map((response: ArrayBuffer) => {
          const blob = new Blob([response], { type: 'image/png' }); // Adjust the type if necessary                              
          return this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));          
        })
      );
  }

}


