# GPU Setup Guide

## Prerequisites

### 1. NVIDIA GPU Requirements
- NVIDIA GPU with CUDA support (GTX 10xx, RTX 20xx/30xx/40xx series or newer)
- At least 4GB VRAM recommended
- Latest NVIDIA drivers installed

### 2. Conda Environment
The project uses a Conda environment for GPU dependencies. Make sure you have:

- Miniconda or Anaconda installed
- The `mpd_gpu` environment created from `environment.yml`

## Running with GPU

### Using Conda Environment
```bash
cd backend

# Activate the GPU environment
conda activate D:\conda_envs\mpd_gpu  # Or your environment path

# Run the application
python app.py
```

### Verify GPU is Working
```bash
# In Python console after activating environment
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}')"
python -c "import onnxruntime; print(f'GPU Providers: {onnxruntime.get_available_providers()}')"
```

---

## Performance Comparison

| Component | CPU Only | GPU Enabled | Improvement |
|-----------|----------|-------------|-------------|
| YOLO Detection | ~50-100ms | ~10-20ms | 5-10x faster |
| Face Embedding | ~200-500ms | ~20-50ms | 10x faster |
| Total FPS | 2-5 FPS | 15-30 FPS | 6-10x faster |
| Memory Usage | 2-4GB RAM | 4-8GB VRAM | Higher but faster |

---

## Troubleshooting

### GPU Not Detected
```bash
# Check if GPU drivers are installed
nvidia-smi

# Check PyTorch GPU detection
python -c "import torch; print(torch.cuda.is_available())"

# Check ONNX Runtime GPU
python -c "import onnxruntime; print(onnxruntime.get_available_providers())"
```

### CUDA Version Mismatch
If you get CUDA version errors:
1. Update NVIDIA drivers to latest
2. Recreate the conda environment with correct CUDA version
3. Check GPU compatibility: https://developer.nvidia.com/cuda-gpus

### Memory Issues
- Reduce batch size in processing
- Use smaller YOLO model
- Close other GPU-intensive applications

---

## Configuration

### Environment Variables
```bash
# Force GPU usage
export CUDA_VISIBLE_DEVICES=0

# Limit GPU memory usage
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:512
```

### Model Selection
For lower-end GPUs, consider:
- YOLOv8n (nano) instead of default model
- Lower confidence thresholds
- Smaller input image sizes

---

## Monitoring GPU Usage

```bash
# Monitor GPU usage in real-time
watch -n 1 nvidia-smi

# Check GPU memory usage
nvidia-smi --query-gpu=memory.used,memory.total --format=csv
```

---

## Fallback to CPU

If GPU setup fails, the container will automatically fall back to CPU processing. No code changes needed!