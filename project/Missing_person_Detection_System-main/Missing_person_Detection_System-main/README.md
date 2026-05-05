  # Missing Person Detection System

  A Flask-based missing person detection API with real-time camera streaming, missing person registration, alerting, and snapshot capture.

  This project uses ArcFace embeddings from InsightFace for face registration and matching, and a YOLO-based realtime detector for live camera streams.

  ## Features

  - **Register Missing Person**: Upload a person's face image and store normalized ArcFace embeddings.
  - **List Stored Targets**: Retrieve all registered missing persons and metadata.
  - **Single Image Detection**: Detect and match a face from an uploaded image.
  - **Realtime Stream Detection**: Start and stop webcam/RTSP/CCTV streams for live matching.
  - **Live Dashboard**: Web pages for admin, camera view, realtime monitoring, and instructions.
  - **Alert System**: Save alert snapshots, log alerts, and emit WebSocket notifications.
  - **Camera Configuration**: Manage configured cameras in `backend/cameras.json`.

  ## Project Structure

  ```
  Missing_person_Detection_System-main/
  ├── backend/
  │   ├── app.py
  │   ├── realtime_detector.py
  │   ├── requirements.txt
  │   ├── environment.yml
  │   ├── best.pt
  │   ├── stored_embeddings.json
  │   ├── uploads/
  │   ├── snapshots/
  │   ├── alerts/
  │   ├── evidence/
  │   ├── static/
  │   └── templates/
  ├── README.md
  └── QUICK_START.md
  ```

  ## Installation

  The recommended setup is a Conda environment, because it is safer for managing CUDA and GPU dependencies.

  1. Create and activate a Conda environment from the provided environment.yml:

  ```bash
  cd backend
  conda env create -f environment.yml
  conda activate mpd_gpu
  ```

  If you need to create the environment manually:

  ```bash
  conda create -n mpd_gpu python=3.10 -y
  conda activate mpd_gpu
  pip install -r requirements.txt
  ```

  2. Install GPU-specific runtime packages after the base requirements:

  ```bash
  conda install -c conda-forge cudatoolkit=12.1 cudnn -y
  # On Windows, install a CUDA-enabled PyTorch build from the PyTorch/NVIDIA channels.
  conda install -c pytorch -c nvidia pytorch torchvision torchaudio pytorch-cuda=12.6 -y
  pip install onnxruntime-gpu==1.23.2
  ```

  If you prefer pip for PyTorch, use the official PyTorch CUDA index instead:

  ```bash
  pip install --index-url https://download.pytorch.org/whl/cu121 torch torchvision torchaudio
  pip install onnxruntime-gpu==1.23.2
  ```

  ### Why this order matters

  - Install `requirements.txt` first in the Conda environment so the base Python dependencies are satisfied.
  - Then install GPU runtime packages, which are platform-specific and best managed by Conda.
  - This avoids mixing incompatible CPU and GPU builds.

  ### CPU vs GPU

  - The project works on CPU, but GPU acceleration is strongly recommended for better realtime performance.
  - `insightface` is configured to prefer `CUDAExecutionProvider` and fall back to CPU if GPU is unavailable.
  - `ultralytics` will also run faster with a CUDA-enabled PyTorch installation.

  ## Running the API

  1. Start the Flask server:

  ```bash
  cd backend
  python app.py
  ```

  2. Open the UI or access the API at:

  ```text
  http://localhost:5001
  ```

  ## Main API Endpoints

  ### Register a Missing Person
  `POST /target_person`

  Request:
  - `name`: string
  - `image`: file upload

  Response:
  - `success`: true/false
  - `message`: status message
  - `name`: registered person name
  - `total_persons`: current database size

  ### List Registered Targets
  `GET /targets`

  Response contains:
  - `success`
  - `count`
  - `targets` array of stored persons

  ### Delete a Registered Person
  `DELETE /target_person/<name>`

  Removes a stored person by name.

  ### Detect Person from Image
  `POST /detect`

  Request:
  - `image`: file upload

  Response returns matching persons if found.

  ### Health Check
  `GET /health`

  Returns API status.

  ### Start Realtime Stream
  `POST /api/stream/start`

  Request body JSON:
  - `source`: webcam index or stream URL
  - `camera_name`: optional camera label

  ### Stop Realtime Stream
  `POST /api/stream/stop`

  ### Stream Status
  `GET /api/stream/status`

  ### Reload Embeddings
  `POST /api/stream/reload`

  ### Alert History
  `GET /api/alerts/history`

  Optional query params:
  - `limit`
  - `person_name`

  ### Snapshot Access
  `GET /api/snapshots/<filename>`

  ### Camera Management
  `GET /api/cameras`
  `POST /api/cameras/save`

  ## Web Interface

  The server also serves frontend pages at:
  - `/` — main landing page
  - `/camera` — camera detection page
  - `/realtime` — realtime dashboard
  - `/admin` — admin panel
  - `/instructions` — usage instructions

  ## Supported Image Formats

  - PNG
  - JPG/JPEG
  - GIF
  - BMP

  Maximum upload size: 16MB

  ## Notes

  - Face registration uses InsightFace `/ ArcFace` for embeddings.
  - Realtime detection uses a YOLO model stored as `backend/best.pt`.
  - Stored embeddings are kept in `backend/stored_embeddings.json`.
  - Uploaded images are stored temporarily in `backend/uploads/`.
  - Alert snapshots are saved in `backend/snapshots/`.
  - Logs are written under `backend/alerts/alerts.log`.
  - Camera sources are defined in `streams/cameras.json`.

  ## Using the Test Scripts

  If you want to test the API with scripts, run them from the project root:

  ```bash
  python scripts/test_upload.py <image_path> "Name"
  python scripts/test_enhanced_system.py
  ```



