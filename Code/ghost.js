/*
  A ghost object that follows the mouse around during dock movement.
*/
function wcGhost(rect, mouse) {
  this.$ghost = null;
  this._rect;
  this._isAnchored = false;
  this._anchorMouse = false;

  this._init(rect, mouse);
};

wcGhost.prototype = {
  _init: function(rect, mouse) {
    this.$ghost = $('<div class="wcGhost">')
      .css('opacity', 0)
      .css('top', rect.y + 'px')
      .css('left', rect.x + 'px')
      .css('width', rect.w + 'px')
      .css('height', rect.h + 'px');

    this._anchorMouse = {
      x: rect.x - mouse.x,
      y: rect.y - mouse.y,
    };

    this._rect = {
      x: -this._anchorMouse.x,
      y: -this._anchorMouse.y,
      w: rect.w,
      h: rect.h,
    };

    this.anchor(mouse, rect);

    $('body').append(this.$ghost);
  },

  // Gets the original size of the moving widget.
  rect: function() {
    return this._rect;
  },

  // Updates the size of the layout.
  move: function(mouse) {
    if (this._isAnchored) {
      return;
    }

    var x = parseInt(this.$ghost.css('left'));
    var y = parseInt(this.$ghost.css('top'));

    x = mouse.x + this._anchorMouse.x;
    y = mouse.y + this._anchorMouse.y;

    this.$ghost.css('left', x + 'px');
    this.$ghost.css('top',  y + 'px');
  },

  // Change the ghost's anchor.
  // Params:
  //    mouse     The current mouse position.
  //    rect      If supplied, will change to this size,
  //              otherwise will revert to default size.
  anchor: function(mouse, rect) {
    if (typeof rect === 'undefined') {
      if (!this._isAnchored) {
        return;
      }

      this._isAnchored = false;

      rect = {
        x: parseInt(this.$ghost.css('left')),
        y: parseInt(this.$ghost.css('top')),
        w: parseInt(this.$ghost.css('width')),
        h: parseInt(this.$ghost.css('height')),
      };

      this._anchorMouse = {
        x: rect.x - mouse.x,
        y: rect.y - mouse.y,
      };

      this._rect.x = -this._anchorMouse.x;
      this._rect.y = -this._anchorMouse.y;

      this.$ghost.stop().animate({
        opacity: 0.3,
        'margin-left': this._rect.x + 'px',
        'margin-top': this._rect.y + 'px',
        width: this._rect.w + 'px',
        height: this._rect.h + 'px',
      }, 200);
      return;
    }

    if (this._isAnchored) {
      return;
    }

    this._isAnchored = true;
    this.$ghost.stop().animate({
      opacity: 0.8,
      'margin-left': '0px',
      'margin-top': '0px',
      left: rect.x + 'px',
      top: rect.y + 'px',
      width: rect.w + 'px',
      height: rect.h + 'px',
    }, 200);
  },

  destroy: function() {
    this.$ghost.stop().animate({
      opacity: 0.0,
    }, {
      duration: 250,
      complete: function() {
        $(this).remove();
      },
    });
  },
};