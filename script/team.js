var CreateTeam = function(num)
{
    var cursor_ = 0;
    var lastCursor_ = -1;
    var teamNum_ = num;
    var portriatImg_ = window.document.getElementById("portriatTeam" + num);
    var nameImg_ = window.document.getElementById("nameTeam" + num);
    var healthbar_ = CreateHealthBar("pnlHealthbarTeam" + num,num);
    var energybar_ = CreateEnergyBar("pnlEnergyBarTeam" + num + "Container",num);
    var comboText_ = null;
    var nbHitsText_ = null;
    var currentCombo_ = 0;
    var currentComboRefCount_ = 0;
    var nbPlayers_ = 0;
    var players_ = [];
    var wins_ = 0;
    var loses_ = 0;
    var draws_ = 0;
    var isAI_ = true;

    var Team = function(num)
    {
        players_ = [];
    }

    Team.prototype.getGame = function() { return game_; }
    Team.prototype.getPlayer = function(value) { return this.getPlayers()[value]; }
    Team.prototype.getPlayers = function() { return players_; }
    Team.prototype.getIsAI = function() { return isAI_; }
    Team.prototype.setPlayers = function(value)
    {
        isAI_ = value.every(function(a)
            {
                return !!a && a.User.IsAI;
            });

        players_ = value;
        this.setPlayerIndexes();
        nbPlayers_ = players_.length;
    }
    Team.prototype.addPlayer = function(player, doSetup, isAi)
    {
        if(!!isAi)
        {
            player.enableAI();
            isAI_ = true;
        }
        else if(!player.User.IsAI)
            isAI_ = false;

        players_.push(player);
        this.setPlayerIndexes();
        nbPlayers_ = players_.length;

        if(!!doSetup)
            game_.getMatch().setupPlayer(player, teamNum_);
    }
    Team.prototype.setPlayerIndexes = function()
    {
        for(var i = 0, length = players_.length; i < length; ++i)
            this.getPlayer(i).setIndex(i);
    }
    Team.prototype.getCursor = function() { return cursor_; }
    Team.prototype.setCursor = function(value) { cursor_ = value; }
    Team.prototype.getLastCursor = function() { return lastCursor_; }
    Team.prototype.setLastCursor = function(value) { lastCursor_ = value; }
    Team.prototype.getTeamNum = function() { return teamNum_; }
    Team.prototype.setTeamNum = function(value) { teamNum_ = value; }
    Team.prototype.getPortriatImg = function() { return portriatImg_; }
    Team.prototype.setPortriatImg = function(value) { portriatImg_ = value; }
    Team.prototype.getNameImg = function() { return nameImg_; }
    Team.prototype.setNameImg = function(value) { nameImg_ = value; }
    Team.prototype.getHealthbar = function() { return healthbar_; }
    Team.prototype.setHealthbar = function(value) { healthbar_ = value; }
    Team.prototype.getEnergybar = function() { return energybar_; }
    Team.prototype.setEnergybar = function(value) { energybar_ = value; }
    Team.prototype.getComboText = function() { return comboText_; }
    Team.prototype.setComboText = function(value) { comboText_ = value; }
    Team.prototype.setNbHitText = function(value) { nbHitsText_ = value; }
    Team.prototype.getCurrentCombo = function() { return currentCombo_; }
    Team.prototype.setCurrentCombo = function(value) { currentCombo_ = value; }
    Team.prototype.incCurrentCombo = function() { ++currentCombo_; }
    Team.prototype.getCurrentComboRefCount = function() { return currentComboRefCount_; }
    Team.prototype.setCurrentComboRefCount = function(value) { currentComboRefCount_ = value; }
    Team.prototype.incCurrentComboRefCount = function() { ++currentComboRefCount_; }
    Team.prototype.getWins = function() { return wins_; }
    Team.prototype.getLoses = function() { return loses_; }
    Team.prototype.getDraws = function() { return draws_; }

    Team.prototype.enableStoryMode = function()
    {
        players_.forEach(function(player) { player.User.enableStoryMode(); });
    }

    Team.prototype.advanceStoryMode = function()
    {
        players_.forEach(function(player) { player.User.advanceStoryMode(); });
    }

    Team.prototype.disableStoryMode = function()
    {
        players_.forEach(function(player)
            {
                player.User.disableStoryMode();
                player.User.reset();
            });
    }

    Team.prototype.onDrawRound = function()
    {
        players_.forEach(function(player) { player.User.onDrawRound(); });
        ++draws_;
    }

    Team.prototype.onWonRound = function()
    {
        players_.forEach(function(player) { player.User.onWonRound(); });
        ++wins_;
    }

    Team.prototype.onLostRound = function()
    {
        players_.forEach(function(player) { player.User.onLostRound(); });
        ++loses_;
    }

    Team.prototype.init = function()
    {
        portriatImg_.style.display = "";
        nameImg_.style.display = "";
        healthbar_.init();
        energybar_.init();
        wins_ = 0;
        loses_ = 0;
        draws_ = 0;

        /*
        imageLookup_.getBgB64(portriatImg_,"images/misc/char-sprites.png");
        imageLookup_.getBgB64(nameImg_,"images/misc/char-sprites.png");
        */
        this.hide();
    }



    Team.prototype.incComboRefCount = function()
    {
        this.incCurrentComboRefCount();
    }


    Team.prototype.decComboRefCount = function()
    {
        this.setCurrentComboRefCount(Math.max(this.getCurrentComboRefCount() - 1, 0));
        if(!this.getCurrentComboRefCount())
        {
            this.setCurrentCombo(0);
        }
    }

    Team.prototype.incCombo = function()
    {
        this.incCurrentCombo();
        if(this.getCurrentCombo() > 1)
            this.writeCombo(this.getCurrentCombo());
    }


    Team.prototype.initText = function()
    {
        comboText_ = game_.addManagedText("pnlTeam" + this.getTeamNum() + "ComboText",0,170,"font2", teamNum_ == 2);
        nbHitsText_ = game_.addManagedText("pnlTeam" + this.getTeamNum() + "NbHitsText",0,170,"font3", teamNum_ == 2);
    }


    Team.prototype.getNbHitsText = function(nbHits)
    {
        if(nbHits == 2) return "GOOD !";
        else if(nbHits == 3) return "GOOD !!";
        else if(nbHits == 4) return "GREAT !";
        else if(nbHits == 5) return "GREAT !!";
        else if(nbHits == 6) return "VERY GOOD !";
        else if(nbHits == 7) return "VERY GOOD !!";
        else if(nbHits == 8) return "WONDERFUL !";
        else if(nbHits == 9) return "WONDERFUL !!";
        else if(nbHits == 10) return "FANTASTIC !";
        else if(nbHits == 11) return "FANTASTIC !!";
        else if(nbHits == 12) return "MARVELOUS !";
        else if(nbHits == 13) return "MARVELOUS !!";
        else if(nbHits == 14) return "MARVELOUS !!!";
        //lets add some more
        else if(nbHits == 15) return "AWESOME !!";
        else if(nbHits == 16) return "AWESOME !!!";
        else if(nbHits == 17) return "VERY AWESOME!!";
        else if(nbHits == 18) return "VERY AWESOME !!!";
        else if(nbHits == 19) return "OUTSTANDING !!";
        else if(nbHits == 20) return "OUTSTANDING !!!";
        else return "DECENT !!!";
    }


    Team.prototype.writeCombo = function(nbHits)
    {
        comboText_.change(nbHits + TEXT.HIT_COMBO,10,game_.getCurrentFrame() + CONSTANTS.COMBO_TEXT_LIFE);
        this.writeText(this.getNbHitsText(nbHits));
    }


    Team.prototype.writeText = function(text)
    {
        nbHitsText_.change(text,10,game_.getCurrentFrame() + CONSTANTS.TEXT_DELAY + CONSTANTS.TEXT_LIFE,game_.getCurrentFrame() + CONSTANTS.TEXT_DELAY,true,30);
    }


    /*remove any DOM element that was added by this instance*/
    Team.prototype.release = function()
    {
        portriatImg_.style.display = "none";
        nameImg_.style.display = "none";
        if(!!comboText_)
        {
            comboText_.hideNow();
            comboText_ = null;
        }
        if(!!nbHitsText_)
        {
            nbHitsText_.hideNow();
            nbHitsText_ = null;
        }
        healthbar_.release();
        energybar_.release();

        utils_.releaseArray(players_);
        this.setCursor(0);
    }

    Team.prototype.show = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).show();
        portriatImg_.parentNode.style.display = "";
    }

    Team.prototype.hide = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).hide();
        portriatImg_.parentNode.style.display = "none";
    }

    Team.prototype.pause = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).pause();
    }

    Team.prototype.resume = function()
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).resume();
    }

    Team.prototype.preFrameMove = function(frame)
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).onPreFrameMove(frame);
    }

    /**/
    Team.prototype.frameMove = function(frame, x, y, allowInput)
    {
        if(frame % 100 == 0)
            this.setCursor(((this.getCursor() + 1) < nbPlayers_) ? (this.getCursor()+1) : 0);

        for(var i = 0, length = nbPlayers_; i < length; ++i)
            if(!!allowInput)
                this.getPlayer(i).handleAI(frame);
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            if(!!allowInput)
                this.getPlayer(i).handleInput(frame);
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).onFrameMove(frame,x,y);

        healthbar_.frameMove(frame);
        energybar_.frameMove(frame);
    }

    Team.prototype.preRender = function(frame)
    {
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).preRender(frame);
    }

    /* Shows details about the players on the team */
    Team.prototype.render = function(frame,deltaX)
    {
        if(this.getCursor() != this.getLastCursor())
        {
            this.setLastCursor(this.getCursor());
            if(!!this.getPlayer(this.getCursor()))
            {
                spriteLookup_.set(nameImg_, this.getPlayer(this.getCursor()).getNameImageSrc());
                spriteLookup_.set(portriatImg_, this.getPlayer(this.getCursor()).getPortriatImageSrc());
            }
        }
        for(var i = 0, length = nbPlayers_; i < length; ++i)
            this.getPlayer(i).render(frame,deltaX);

        energybar_.render(frame);
        healthbar_.render(frame);
    }

    return new Team(num);
}