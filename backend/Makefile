.PHONY: setup install test clean help activate

# CONFIG
PYTHON_VERSION = 3.12
VENV = .venv
UV = uv

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

venv:
	$(UV) venv --python $(PYTHON_VERSION)
	$(UV) pip install -r requirements.txt

setup:
	$(UV) venv --python $(PYTHON_VERSION)

install:
	$(UV) pip install -r requirements.txt

activate:
	source $(VENV)/bin/activate

test:
	python -m pytest

clean:
	rm -rf $(VENV)
